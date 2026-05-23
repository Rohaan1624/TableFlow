CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'images'
  AND (storage.foldername(name))[1] IN ('menu-items', 'general', 'logos')
);