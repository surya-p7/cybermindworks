-- Check current database state
\dt

-- If jobs table exists, show its structure
\d jobs

-- Show column names
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'jobs';

-- Count rows
SELECT COUNT(*) as row_count FROM jobs;
