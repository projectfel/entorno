
-- =========================================================
-- 1. Anti-fraude: recalcula total do pedido no servidor
-- =========================================================
-- Items shape esperado: [{ product_id: uuid, quantity: number, price?: number }]
-- O trigger ignora o "price" e "total" enviados pelo cliente e recalcula
-- a partir de products.price (fonte da verdade).

CREATE OR REPLACE FUNCTION public.orders_validate_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  computed_total numeric := 0;
  item jsonb;
  prod_price numeric;
  prod_store uuid;
  qty numeric;
BEGIN
  IF NEW.items IS NULL OR jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  IF jsonb_array_length(NEW.items) > 200 THEN
    RAISE EXCEPTION 'Order exceeds maximum of 200 items';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    IF NOT (item ? 'product_id') OR NOT (item ? 'quantity') THEN
      RAISE EXCEPTION 'Each item requires product_id and quantity';
    END IF;

    qty := (item->>'quantity')::numeric;
    IF qty IS NULL OR qty <= 0 OR qty > 1000 THEN
      RAISE EXCEPTION 'Invalid quantity for item';
    END IF;

    SELECT price, store_id INTO prod_price, prod_store
    FROM public.products
    WHERE id = (item->>'product_id')::uuid AND in_stock = true;

    IF prod_price IS NULL THEN
      RAISE EXCEPTION 'Product % not found or out of stock', item->>'product_id';
    END IF;

    IF prod_store <> NEW.store_id THEN
      RAISE EXCEPTION 'All products must belong to the same store as the order';
    END IF;

    computed_total := computed_total + (prod_price * qty);
  END LOOP;

  -- Tolerância de 1 centavo para arredondamento
  IF abs(computed_total - NEW.total) > 0.01 THEN
    RAISE EXCEPTION 'Order total mismatch: expected %, got %', computed_total, NEW.total;
  END IF;

  -- Sobrescreve com valor canônico
  NEW.total := computed_total;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_validate_total_trigger ON public.orders;
CREATE TRIGGER orders_validate_total_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_validate_total();

-- =========================================================
-- 2. CHECK constraints de tamanho (anti-abuse)
-- =========================================================
ALTER TABLE public.orders
  ADD CONSTRAINT orders_notes_length CHECK (notes IS NULL OR char_length(notes) <= 1000);

ALTER TABLE public.products
  ADD CONSTRAINT products_name_length CHECK (char_length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT products_description_length CHECK (description IS NULL OR char_length(description) <= 2000),
  ADD CONSTRAINT products_price_positive CHECK (price >= 0 AND price <= 1000000);

ALTER TABLE public.stores
  ADD CONSTRAINT stores_name_length CHECK (char_length(name) BETWEEN 1 AND 150),
  ADD CONSTRAINT stores_description_length CHECK (description IS NULL OR char_length(description) <= 2000);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length CHECK (display_name IS NULL OR char_length(display_name) <= 100),
  ADD CONSTRAINT profiles_address_length CHECK (address IS NULL OR char_length(address) <= 500);

-- =========================================================
-- 3. Auditoria de ações sensíveis
-- =========================================================
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Inserts apenas via SECURITY DEFINER functions ou triggers (sem policy de INSERT pública).

-- Trigger: log mudanças em user_roles
CREATE OR REPLACE FUNCTION public.log_user_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    TG_OP,
    'user_role',
    COALESCE(NEW.user_id, OLD.user_id),
    jsonb_build_object(
      'old_role', CASE WHEN TG_OP <> 'INSERT' THEN OLD.role::text END,
      'new_role', CASE WHEN TG_OP <> 'DELETE' THEN NEW.role::text END
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER user_roles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_user_role_change();

-- Trigger: log criação/exclusão de stores
CREATE OR REPLACE FUNCTION public.log_store_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    TG_OP,
    'store',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('name', COALESCE(NEW.name, OLD.name))
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER stores_audit
  AFTER INSERT OR DELETE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.log_store_change();

-- =========================================================
-- 4. Remover schema legado de loyalty (feature foi removida)
-- =========================================================
DROP TABLE IF EXISTS public.loyalty_rewards CASCADE;
DROP TABLE IF EXISTS public.loyalty_points CASCADE;
