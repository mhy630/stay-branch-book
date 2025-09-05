-- First check what values we have in the rooms table that might be causing issues
SELECT id, apartment_id, branch_id, name FROM public.rooms;

-- Drop the constraint entirely and recreate it properly
ALTER TABLE public.rooms 
DROP CONSTRAINT IF EXISTS check_apartment_or_branch;

-- Ensure any existing rooms that have null values in both fields get fixed
UPDATE public.rooms 
SET branch_id = (SELECT id FROM public.branches LIMIT 1)
WHERE apartment_id IS NULL AND branch_id IS NULL;

-- Add the constraint again with proper logic
ALTER TABLE public.rooms 
ADD CONSTRAINT check_apartment_or_branch 
CHECK (
  (apartment_id IS NOT NULL AND branch_id IS NULL) OR 
  (apartment_id IS NULL AND branch_id IS NOT NULL)
);