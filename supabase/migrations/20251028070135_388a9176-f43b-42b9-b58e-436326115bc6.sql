-- Create storage bucket for pitch materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-materials', 'pitch-materials', true);

-- Storage policies for pitch materials
CREATE POLICY "Anyone can view pitch materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-materials');

CREATE POLICY "Entrepreneurs can upload pitch materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pitch-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'entrepreneur'
  )
);

CREATE POLICY "Entrepreneurs can update their pitch materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pitch-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Entrepreneurs can delete their pitch materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pitch-materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add status column to ideas table for draft functionality
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));

-- Update RLS policy to only show published ideas to everyone (except own drafts)
DROP POLICY IF EXISTS "Ideas are viewable by everyone" ON ideas;

CREATE POLICY "Published ideas are viewable by everyone"
ON ideas FOR SELECT
USING (status = 'published' OR auth.uid() = user_id);