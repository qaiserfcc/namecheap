-- Insert sample admin user (password: admin123)
-- Insert sample admin user (password: password123)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@cheapname.tyo', '$2b$10$XmOtnYWutVe/HqiRxhAqH.iGzd2nwKmlZdr0GIhxuZKm2G4/oj.BW', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample organic products
INSERT INTO products (name, description, price, category, stock_quantity, is_organic) 
VALUES 
('Organic Face Wash', 'Gentle organic face cleanser with natural ingredients', 450, 'Skincare', 50, true),
('Honey Mask', 'Pure organic honey facial mask for glowing skin', 650, 'Skincare', 35, true),
('Aloe Vera Gel', 'Natural aloe vera gel for skin and hair', 350, 'Skincare', 60, true),
('Organic Shampoo', 'Sulfate-free organic shampoo for all hair types', 550, 'Haircare', 45, true),
('Coconut Oil', 'Pure organic coconut oil for skin and cooking', 800, 'Health', 40, true),
('Turmeric Powder', 'Certified organic turmeric with high curcumin content', 400, 'Health', 55, true),
('Rose Water', 'Natural organic rose water for skin hydration', 500, 'Skincare', 50, true),
('Neem Oil', 'Organic neem oil for skin and scalp health', 600, 'Health', 30, true)
ON CONFLICT DO NOTHING;
