-- Add latitude and longitude to branches for map integration
ALTER TABLE branches ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE branches ADD COLUMN longitude DECIMAL(11, 8);

-- Add image field to rooms for photo upload
ALTER TABLE rooms ADD COLUMN image TEXT;