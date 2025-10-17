-- Quick database reset for development
-- This will delete all data and let TypeORM recreate the schema

-- Drop all tables
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- TypeORM will automatically recreate tables with the new schema when you start the backend
