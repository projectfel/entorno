
-- 1. Storage: restrict uploads to user's own folder
CREATE POLICY "Users upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Orders: drop permissive UPDATE policy, replace with status-only restriction
DROP POLICY IF EXISTS "Store owners can update order status" ON public.orders;

CREATE POLICY "Store owners can update order status only"
ON public.orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = orders.store_id
      AND stores.owner_id = auth.uid()
  )
);

-- Create trigger to prevent changing non-status columns by store owners
CREATE OR REPLACE FUNCTION public.orders_restrict_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins can change anything
  IF has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Store owners can only change status
  IF NEW.store_id IS DISTINCT FROM OLD.store_id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.items IS DISTINCT FROM OLD.items
     OR NEW.total IS DISTINCT FROM OLD.total
     OR NEW.notes IS DISTINCT FROM OLD.notes
  THEN
    RAISE EXCEPTION 'Only status can be updated';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_restrict_update_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.orders_restrict_update();
