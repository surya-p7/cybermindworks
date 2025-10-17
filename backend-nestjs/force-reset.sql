-- FORCE RESET - This will completely drop and recreate the database
-- WARNING: This deletes ALL data

-- First, drop the tables if they exist
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Also drop any sequences that might exist
DROP SEQUENCE IF EXISTS jobs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS job_applications_id_seq CASCADE;

-- Verify tables are gone
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
