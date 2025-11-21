-- Create table for tracking confidentiality agreements
CREATE TABLE public.idea_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL,
  agreed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, investor_id)
);

-- Enable RLS
ALTER TABLE public.idea_agreements ENABLE ROW LEVEL SECURITY;

-- Policies for idea_agreements
CREATE POLICY "Investors can view their own agreements"
  ON public.idea_agreements
  FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Investors can create their own agreements"
  ON public.idea_agreements
  FOR INSERT
  WITH CHECK (
    auth.uid() = investor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() 
      AND profiles.user_type = 'investor'
    )
  );

-- Create table for tracking investment interests
CREATE TABLE public.investment_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, investor_id)
);

-- Enable RLS
ALTER TABLE public.investment_interests ENABLE ROW LEVEL SECURITY;

-- Policies for investment_interests
CREATE POLICY "Investors can view their own interests"
  ON public.investment_interests
  FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Entrepreneurs can view interests in their ideas"
  ON public.investment_interests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Investors can create their own interests"
  ON public.investment_interests
  FOR INSERT
  WITH CHECK (
    auth.uid() = investor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid() 
      AND profiles.user_type = 'investor'
    )
  );

CREATE POLICY "Investors can update their own interests"
  ON public.investment_interests
  FOR UPDATE
  USING (auth.uid() = investor_id);

-- Add trigger for updated_at
CREATE TRIGGER update_investment_interests_updated_at
  BEFORE UPDATE ON public.investment_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();