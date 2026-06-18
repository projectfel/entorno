
-- Wipe everything except admin user
DO $$
DECLARE
  admin_id uuid := '03c8b1e1-74b6-4e76-872f-0aa429bded6c';
BEGIN
  DELETE FROM public.stock_movements;
  DELETE FROM public.combo_items;
  DELETE FROM public.combos;
  DELETE FROM public.orders;
  DELETE FROM public.products;
  DELETE FROM public.stores;
  DELETE FROM public.audit_log WHERE actor_id IS DISTINCT FROM admin_id;
  DELETE FROM public.user_roles WHERE user_id <> admin_id;
  DELETE FROM public.profiles WHERE user_id <> admin_id;
  DELETE FROM auth.users WHERE id <> admin_id;
END $$;
