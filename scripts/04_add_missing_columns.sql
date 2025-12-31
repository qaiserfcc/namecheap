-- Add full_name column to users table if it doesn't exist
-- This migration fixes the "column full_name does not exist" error

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
  END IF;
END $$;

-- Also ensure phone column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
  END IF;
END $$;

-- Update existing admin user to ensure it has proper fields
UPDATE users 
SET full_name = 'Admin User', 
    phone = '+92 300 0000000'
WHERE email = 'admin@namecheap.com' AND full_name IS NULL;
