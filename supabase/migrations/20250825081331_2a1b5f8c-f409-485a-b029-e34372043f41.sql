-- Add images array columns to apartments and rooms tables
ALTER TABLE apartments ADD COLUMN images TEXT[] DEFAULT '{}';
ALTER TABLE rooms ADD COLUMN images TEXT[] DEFAULT '{}';

-- Migrate existing single images to arrays
UPDATE apartments SET images = ARRAY[image] WHERE image IS NOT NULL AND image != '';
UPDATE rooms SET images = ARRAY[image] WHERE image IS NOT NULL AND image != '';