-- Create schemas for service separation
CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS blog_schema;

-- Grant privileges to current user (works for both dev and prod)
GRANT ALL ON SCHEMA auth_schema TO CURRENT_USER;
GRANT ALL ON SCHEMA blog_schema TO CURRENT_USER;
