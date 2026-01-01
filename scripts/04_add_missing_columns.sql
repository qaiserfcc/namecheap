-- Migration 01: Add missing columns to users table
-- This migration fixes the "column full_name/phone does not exist" errors
-- Run this BEFORE inserting sample data

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
  END IF;
END $$;

-- Migration 02: Add missing is_organic column to products table
-- This migration fixes the "column is_organic does not exist" error
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_organic'
  ) THEN
    ALTER TABLE products ADD COLUMN is_organic BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Update existing admin user if needed
UPDATE users 
SET full_name = 'Admin User', 
    phone = '+92 300 0000000'
WHERE email = 'admin@namecheap.com' AND full_name IS NULL;
