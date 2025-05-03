-- Add latitude and longitude columns to restaurant table
ALTER TABLE restaurant ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE restaurant ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- Set default coordinates for existing restaurants (San Jose coordinates)
UPDATE restaurant SET lat = 37.3382, lng = -121.8863 WHERE lat IS NULL; 