-- Fix the rooms table to allow association with either apartments or branches
-- First, make apartment_id nullable since rooms can be associated with branches instead
ALTER TABLE public.rooms 
ALTER COLUMN apartment_id DROP NOT NULL;

-- Drop the existing check constraint if it exists
ALTER TABLE public.rooms 
DROP CONSTRAINT IF EXISTS check_apartment_or_branch;

-- Add a proper check constraint to ensure room is associated with either apartment OR branch (but not both or neither)
ALTER TABLE public.rooms 
ADD CONSTRAINT check_apartment_or_branch 
CHECK (
  (apartment_id IS NOT NULL AND branch_id IS NULL) OR 
  (apartment_id IS NULL AND branch_id IS NOT NULL)
);