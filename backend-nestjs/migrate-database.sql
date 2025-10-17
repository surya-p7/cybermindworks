-- Migration script for adding authentication to job portal
-- Run this in PostgreSQL before starting the updated backend

-- Step 1: Delete existing data (for development only)
-- If you want to keep existing data, skip this and follow Step 2 instead
TRUNCATE TABLE job_applications CASCADE;
TRUNCATE TABLE jobs CASCADE;
TRUNCATE TABLE users CASCADE;

-- Step 2: Alternative - If you want to keep existing jobs
-- Create a default system user first, then assign all jobs to this user
-- Uncomment the following if you want to preserve existing data:

/*
-- Create a system user for existing jobs
INSERT INTO users (id, email, password, "fullName", role, "createdAt", "updatedAt")
VALUES (
  'system-user-id-12345',
  'system@jobportal.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', -- dummy hash
  'System User',
  'employer',
  NOW(),
  NOW()
);

-- Update existing jobs to have this user as poster
UPDATE jobs SET posted_by_id = 'system-user-id-12345' WHERE posted_by_id IS NULL;
*/

-- Step 3: Verify the changes
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Jobs count:', COUNT(*) FROM jobs
UNION ALL
SELECT 'Applications count:', COUNT(*) FROM job_applications;
