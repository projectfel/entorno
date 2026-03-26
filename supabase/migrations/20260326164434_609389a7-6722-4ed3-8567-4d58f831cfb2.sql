
-- Allow authenticated users to see stores (including whatsapp for checkout)
-- but keep anon users restricted to stores_public view
DROP POLICY IF EXISTS "Owners can view own store details" ON public.stores;

CREATE POLICY "Authenticated users can view stores"
  ON public.stores FOR SELECT TO authenticated
  USING (true);
