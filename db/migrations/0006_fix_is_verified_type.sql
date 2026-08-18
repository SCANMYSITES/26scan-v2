ALTER TABLE users
ALTER COLUMN is_verified TYPE boolean
USING is_verified::boolean;
