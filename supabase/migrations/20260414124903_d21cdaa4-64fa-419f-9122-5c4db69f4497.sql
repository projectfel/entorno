-- Must drop and recreate since we're adding columns
DROP VIEW IF EXISTS public.stores_public;

CREATE VIEW public.stores_public
WITH (security_invoker = off)
AS
SELECT id, name, description, cover_image, logo_url, address, neighborhood,
       status, opens_at, closes_at, rating, total_ratings,
       delivery_fee, min_order, delivery_time_min, delivery_time_max,
       whatsapp, phone, created_at, updated_at
FROM stores;

-- Grant access to the view for anon and authenticated
GRANT SELECT ON public.stores_public TO anon, authenticated;

-- Allow anon users to SELECT from stores (needed for product joins like stores(name))
CREATE POLICY "Anon can view stores" ON public.stores
  FOR SELECT TO anon USING (true);
