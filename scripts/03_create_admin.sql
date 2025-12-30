-- Create admin user with proper bcrypt hash for password: admin123
-- Use this hash: $2a$10$8PDsj5.zcJY8X5I7qJXQye3t1nPfXaB3Y2v.nKvX2nQ7.Z8Hm4Hta
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@namecheap.com', '$2a$10$8PDsj5.zcJY8X5I7qJXQye3t1nPfXaB3Y2v.nKvX2nQ7.Z8Hm4Hta', 'Namecheap Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
