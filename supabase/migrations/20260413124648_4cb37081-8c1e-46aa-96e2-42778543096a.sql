
-- Remove old permissive upload policy (allows any path)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Remove duplicate old policies
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
