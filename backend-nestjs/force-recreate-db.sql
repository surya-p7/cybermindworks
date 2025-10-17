-- Force disconnect all users from jobmanagement database
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'jobmanagement'
  AND pid <> pg_backend_pid();

-- Now drop the database
DROP DATABASE IF EXISTS jobmanagement;

-- Create a fresh new database
CREATE DATABASE jobmanagement;

-- Confirm it was created
\l jobmanagement
