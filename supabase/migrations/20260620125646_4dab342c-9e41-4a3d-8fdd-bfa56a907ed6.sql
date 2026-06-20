DROP POLICY IF EXISTS "Anon can view stores" ON public.stores;
REVOKE SELECT ON public.stores FROM anon;