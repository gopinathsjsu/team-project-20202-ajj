-- Ensure status column exists and has correct values
UPDATE restaurant SET status = 'APPROVED' WHERE status IS NULL OR status = '';

-- Ensure lat/lng columns exist and have default values if null
UPDATE restaurant SET lat = 37.3382 WHERE lat IS NULL;
UPDATE restaurant SET lng = -121.8863 WHERE lng IS NULL; 