-- Create a completely new database
-- First, disconnect from jobmanagement and connect to postgres database

-- Drop the old database if it exists (this will force disconnect all connections)
DROP DATABASE IF EXISTS jobmanagement;

-- Create a fresh new database
CREATE DATABASE jobmanagement;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE jobmanagement TO postgres;
