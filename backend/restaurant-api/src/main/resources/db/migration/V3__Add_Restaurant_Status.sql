-- Add status column to restaurant table
ALTER TABLE restaurant ADD COLUMN IF NOT EXISTS status VARCHAR(20);

-- Set default status to APPROVED for existing restaurants
UPDATE restaurant SET status = 'APPROVED' WHERE status IS NULL;

-- Make status column NOT NULL
ALTER TABLE restaurant ALTER COLUMN status SET NOT NULL; 