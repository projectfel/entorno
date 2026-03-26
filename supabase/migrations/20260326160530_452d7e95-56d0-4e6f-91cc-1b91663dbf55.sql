-- Fix 1: orders INSERT policy - require non-null user_id
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Fix 2: Create secure public view for stores (hides phone/whatsapp)
DROP VIEW IF EXISTS public.stores_public;
CREATE OR REPLACE VIEW public.stores_public AS
SELECT 
  id, name, description, cover_image, logo_url, address, neighborhood,
  status, opens_at, closes_at, rating, total_ratings,
  delivery_fee, min_order, delivery_time_min, delivery_time_max,
  created_at, updated_at, owner_id
FROM public.stores;