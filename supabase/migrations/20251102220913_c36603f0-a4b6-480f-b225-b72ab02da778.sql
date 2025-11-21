-- Add KYC, Contact, and Bank Account fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_storage_path text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nin text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bvn text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_type text; -- 'passport', 'drivers_license', 'nin_card'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_document_url text;

-- Contact Details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS home_address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram text;

-- Bank Account Details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_name text;

-- Profile completion tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_completed boolean DEFAULT false;