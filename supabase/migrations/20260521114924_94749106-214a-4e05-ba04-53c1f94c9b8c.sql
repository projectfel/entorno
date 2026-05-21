DROP VIEW IF EXISTS public.stores_public;

CREATE VIEW public.stores_public
WITH (security_invoker = off)
AS
SELECT id, name, description, cover_image, logo_url, address, neighborhood,
       status, opens_at, closes_at, rating, total_ratings,
       delivery_fee, min_order, delivery_time_min, delivery_time_max,
       whatsapp, phone, slogan, instagram, facebook, year_founded,
       verified, specialties, created_at, updated_at
FROM stores;

GRANT SELECT ON public.stores_public TO anon, authenticated;