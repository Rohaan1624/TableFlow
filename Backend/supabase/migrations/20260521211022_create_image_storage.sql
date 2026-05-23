-- Create the bucket
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'images',
  'images',
  true,                                                        -- public bucket
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'], -- allowed types
  5242880                                                      -- 5MB in bytes
);

-- Anyone can view
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Users can only delete their own uploads
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND owner = auth.uid());