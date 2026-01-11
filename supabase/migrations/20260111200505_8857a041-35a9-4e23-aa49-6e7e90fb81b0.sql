-- Add profile fields for ML predictions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS bmi numeric(4,1),
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other'));