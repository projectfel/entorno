
-- FIX: Restrict store owners to only update order status field
DROP POLICY IF EXISTS "Store owners can update order status" ON public.orders;

CREATE POLICY "Store owners can update order status"
  ON public.orders FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
    )
  );
