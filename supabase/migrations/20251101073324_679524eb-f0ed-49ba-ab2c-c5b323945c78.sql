-- Create a function to safely increment idea views without race conditions
CREATE OR REPLACE FUNCTION public.increment_idea_views(idea_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ideas
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = idea_id;
END;
$$;
