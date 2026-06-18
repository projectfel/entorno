
-- 1) Recreate stores_public as SECURITY INVOKER view; mask merchant contact for anonymous users
DROP VIEW IF EXISTS public.stores_public;
CREATE VIEW public.stores_public
WITH (security_invoker = true)
AS
SELECT
  id, name, description, cover_image, logo_url, address, neighborhood,
  status, opens_at, closes_at, rating, total_ratings, delivery_fee,
  min_order, delivery_time_min, delivery_time_max,
  CASE WHEN auth.uid() IS NOT NULL THEN whatsapp END AS whatsapp,
  CASE WHEN auth.uid() IS NOT NULL THEN phone    END AS phone,
  slogan, instagram, facebook, year_founded, verified, specialties,
  created_at, updated_at
FROM public.stores;
GRANT SELECT ON public.stores_public TO anon, authenticated;

-- 2) Enforce orders.user_id NOT NULL so anonymous order insertion is impossible at the schema level
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

-- 3) Lock down SECURITY DEFINER trigger/helper functions: no direct EXECUTE from clients
REVOKE EXECUTE ON FUNCTION public.log_stock_change()               FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()       FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.orders_restrict_update()         FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decrement_stock_on_order_confirm() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_user_role_change()           FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_store_change()               FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.orders_validate_total()          FROM PUBLIC, anon, authenticated;
