-- Recreate stores_public view WITHOUT security_invoker so it runs as definer (bypasses RLS)
DROP VIEW IF EXISTS public.stores_public;

CREATE VIEW public.stores_public
WITH (security_invoker = off) AS
SELECT
  id,
  name,
  description,
  cover_image,
  logo_url,
  address,
  neighborhood,
  status,
  opens_at,
  closes_at,
  rating,
  total_ratings,
  delivery_fee,
  min_order,
  delivery_time_min,
  delivery_time_max,
  created_at,
  updated_at
FROM public.stores;

-- Grant anon and authenticated access to the view
GRANT SELECT ON public.stores_public TO anon;
GRANT SELECT ON public.stores_public TO authenticated;