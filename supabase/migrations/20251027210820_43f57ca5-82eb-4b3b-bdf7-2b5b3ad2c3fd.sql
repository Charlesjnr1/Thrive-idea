-- Create user_type enum
CREATE TYPE user_type AS ENUM ('entrepreneur', 'investor');

-- Create business_stage enum  
CREATE TYPE business_stage AS ENUM ('idea', 'mvp', 'revenue', 'scaling');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  bio TEXT,
  user_type user_type NOT NULL,
  avatar_url TEXT,
  location TEXT,
  
  -- Entrepreneur specific fields
  startup_name TEXT,
  industry TEXT,
  stage business_stage,
  website TEXT,
  
  -- Investor specific fields
  organization TEXT,
  investment_range_min INTEGER,
  investment_range_max INTEGER,
  interests TEXT[], -- Array of industries they're interested in
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create ideas table
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  business_stage business_stage NOT NULL,
  funding_needed INTEGER NOT NULL,
  pitch_deck_url TEXT,
  video_url TEXT,
  location TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create idea_followers table (for investors to save/follow ideas)
CREATE TABLE public.idea_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  investor_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(idea_id, investor_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_followers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Ideas policies
CREATE POLICY "Ideas are viewable by everyone"
  ON public.ideas FOR SELECT
  USING (true);

CREATE POLICY "Entrepreneurs can insert their own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'entrepreneur'
    )
  );

CREATE POLICY "Entrepreneurs can update their own ideas"
  ON public.ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Entrepreneurs can delete their own ideas"
  ON public.ideas FOR DELETE
  USING (auth.uid() = user_id);

-- Idea followers policies
CREATE POLICY "Everyone can view followers"
  ON public.idea_followers FOR SELECT
  USING (true);

CREATE POLICY "Investors can follow ideas"
  ON public.idea_followers FOR INSERT
  WITH CHECK (
    auth.uid() = investor_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND user_type = 'investor'
    )
  );

CREATE POLICY "Investors can unfollow ideas"
  ON public.idea_followers FOR DELETE
  USING (auth.uid() = investor_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_ideas_category ON public.ideas(category);
CREATE INDEX idx_ideas_business_stage ON public.ideas(business_stage);
CREATE INDEX idx_idea_followers_idea_id ON public.idea_followers(idea_id);
CREATE INDEX idx_idea_followers_investor_id ON public.idea_followers(investor_id);