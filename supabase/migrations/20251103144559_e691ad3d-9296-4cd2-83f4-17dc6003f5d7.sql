-- Create enum type for funding type
CREATE TYPE funding_type AS ENUM ('investor', 'crowdfunding');

-- Add funding_type column to ideas table
ALTER TABLE public.ideas 
ADD COLUMN funding_type funding_type NOT NULL DEFAULT 'investor';