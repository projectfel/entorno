-- Add stock and gallery fields to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_products_store_stock ON public.products(store_id, stock_quantity);

-- Stock movements table
CREATE TYPE stock_movement_type AS ENUM ('purchase', 'sale', 'adjustment', 'loss', 'return', 'import');

CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  type stock_movement_type NOT NULL,
  quantity integer NOT NULL,
  balance_after integer NOT NULL,
  reason text,
  reference_id uuid,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id, created_at DESC);
CREATE INDEX idx_stock_movements_store ON public.stock_movements(store_id, created_at DESC);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners view own movements" ON public.stock_movements
  FOR SELECT USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = stock_movements.store_id AND stores.owner_id = auth.uid()));

CREATE POLICY "Store owners insert own movements" ON public.stock_movements
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = stock_movements.store_id AND stores.owner_id = auth.uid()));

CREATE POLICY "Admins view all movements" ON public.stock_movements
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger: auto-create stock_movement when stock_quantity changes manually
CREATE OR REPLACE FUNCTION public.log_stock_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.stock_quantity IS DISTINCT FROM OLD.stock_quantity THEN
    INSERT INTO public.stock_movements (product_id, store_id, type, quantity, balance_after, reason, actor_id)
    VALUES (
      NEW.id,
      NEW.store_id,
      'adjustment',
      NEW.stock_quantity - OLD.stock_quantity,
      NEW.stock_quantity,
      'Ajuste manual',
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_log_stock_change
  AFTER UPDATE OF stock_quantity ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.log_stock_change();

-- Trigger: decrement stock when order is confirmed
CREATE OR REPLACE FUNCTION public.decrement_stock_on_order_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  pid uuid;
  qty integer;
  new_bal integer;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status <> 'confirmed') THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
      pid := (item->>'product_id')::uuid;
      qty := (item->>'quantity')::int;
      UPDATE public.products 
        SET stock_quantity = GREATEST(0, stock_quantity - qty)
        WHERE id = pid
        RETURNING stock_quantity INTO new_bal;
      -- Insert sale movement directly (bypasses log_stock_change which already fired as 'adjustment')
      INSERT INTO public.stock_movements (product_id, store_id, type, quantity, balance_after, reason, reference_id, actor_id)
      VALUES (pid, NEW.store_id, 'sale', -qty, COALESCE(new_bal, 0), 'Pedido confirmado', NEW.id, auth.uid());
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_decrement_stock
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_stock_on_order_confirm();