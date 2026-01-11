-- Add height and weight columns for BMI calculation
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS height numeric(5,2),
ADD COLUMN IF NOT EXISTS weight numeric(5,2);