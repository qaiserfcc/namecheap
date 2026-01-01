-- Enhanced Seed Data: Multiple Images, Variants, Dashboard Content
-- Safe for re-run with ON CONFLICT clauses

-- ============================================
-- ENHANCED PRODUCT DATA WITH MULTIPLE IMAGES
-- ============================================

-- Clear existing sample data for fresh seed (optional - comment out if you want to keep existing)
-- DELETE FROM product_images;
-- DELETE FROM product_variants;

-- Get product IDs for reference
DO $$
DECLARE
  face_wash_id INT;
  honey_mask_id INT;
  aloe_vera_id INT;
  shampoo_id INT;
  coconut_oil_id INT;
  turmeric_id INT;
  rose_water_id INT;
  neem_oil_id INT;
BEGIN
  SELECT id INTO face_wash_id FROM products WHERE name = 'Organic Face Wash' LIMIT 1;
  SELECT id INTO honey_mask_id FROM products WHERE name = 'Honey Mask' LIMIT 1;
  SELECT id INTO aloe_vera_id FROM products WHERE name = 'Aloe Vera Gel' LIMIT 1;
  SELECT id INTO shampoo_id FROM products WHERE name = 'Organic Shampoo' LIMIT 1;
  SELECT id INTO coconut_oil_id FROM products WHERE name = 'Coconut Oil' LIMIT 1;
  SELECT id INTO turmeric_id FROM products WHERE name = 'Turmeric Powder' LIMIT 1;
  SELECT id INTO rose_water_id FROM products WHERE name = 'Rose Water' LIMIT 1;
  SELECT id INTO neem_oil_id FROM products WHERE name = 'Neem Oil' LIMIT 1;

  -- Product Images (Multiple images per product)
  IF face_wash_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (face_wash_id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', true, 0),
    (face_wash_id, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500', false, 1),
    (face_wash_id, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF honey_mask_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (honey_mask_id, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500', true, 0),
    (honey_mask_id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', false, 1),
    (honey_mask_id, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF aloe_vera_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (aloe_vera_id, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', true, 0),
    (aloe_vera_id, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', false, 1),
    (aloe_vera_id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF shampoo_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (shampoo_id, 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500', true, 0),
    (shampoo_id, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500', false, 1),
    (shampoo_id, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF coconut_oil_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (coconut_oil_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', true, 0),
    (coconut_oil_id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', false, 1),
    (coconut_oil_id, 'https://images.unsplash.com/photo-1609907830015-602638e73bce?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF turmeric_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (turmeric_id, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', true, 0),
    (turmeric_id, 'https://images.unsplash.com/photo-1599009434262-c07f55a0f409?w=500', false, 1),
    (turmeric_id, 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF rose_water_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (rose_water_id, 'https://images.unsplash.com/photo-1588112952565-c94dc6e82580?w=500', true, 0),
    (rose_water_id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', false, 1),
    (rose_water_id, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF neem_oil_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
    (neem_oil_id, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', true, 0),
    (neem_oil_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', false, 1),
    (neem_oil_id, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', false, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ============================================
  -- PRODUCT VARIANTS
  -- ============================================

  -- Face Wash Variants (Size variations)
  IF face_wash_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (face_wash_id, 'Small (50ml)', 'FW-50ML', 450, 50, '{"size": "50ml", "volume": "small"}'),
    (face_wash_id, 'Medium (100ml)', 'FW-100ML', 650, 75, '{"size": "100ml", "volume": "medium"}'),
    (face_wash_id, 'Large (200ml)', 'FW-200ML', 950, 40, '{"size": "200ml", "volume": "large"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Honey Mask Variants
  IF honey_mask_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (honey_mask_id, 'Regular (100g)', 'HM-100G', 650, 35, '{"size": "100g", "type": "regular"}'),
    (honey_mask_id, 'Premium (150g)', 'HM-150G', 850, 25, '{"size": "150g", "type": "premium"}'),
    (honey_mask_id, 'Travel Size (50g)', 'HM-50G', 450, 50, '{"size": "50g", "type": "travel"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Aloe Vera Gel Variants
  IF aloe_vera_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (aloe_vera_id, 'Pure Gel (100ml)', 'AVG-100ML', 350, 60, '{"size": "100ml", "purity": "99%"}'),
    (aloe_vera_id, 'Extra Hydrating (150ml)', 'AVG-150ML', 500, 45, '{"size": "150ml", "purity": "99%", "enriched": true}'),
    (aloe_vera_id, 'Family Pack (250ml)', 'AVG-250ML', 750, 30, '{"size": "250ml", "purity": "99%"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Shampoo Variants
  IF shampoo_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (shampoo_id, 'Normal Hair (200ml)', 'SH-N-200', 550, 45, '{"size": "200ml", "hair_type": "normal"}'),
    (shampoo_id, 'Dry Hair (200ml)', 'SH-D-200', 600, 35, '{"size": "200ml", "hair_type": "dry"}'),
    (shampoo_id, 'Oily Hair (200ml)', 'SH-O-200', 600, 40, '{"size": "200ml", "hair_type": "oily"}'),
    (shampoo_id, 'Family Pack (500ml)', 'SH-F-500', 1200, 20, '{"size": "500ml", "hair_type": "all"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Coconut Oil Variants
  IF coconut_oil_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (coconut_oil_id, 'Small Jar (100ml)', 'CO-100ML', 800, 40, '{"size": "100ml", "type": "virgin"}'),
    (coconut_oil_id, 'Medium Jar (250ml)', 'CO-250ML', 1500, 30, '{"size": "250ml", "type": "virgin"}'),
    (coconut_oil_id, 'Large Jar (500ml)', 'CO-500ML', 2500, 20, '{"size": "500ml", "type": "virgin"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Turmeric Powder Variants
  IF turmeric_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (turmeric_id, 'Standard (100g)', 'TU-100G', 400, 55, '{"size": "100g", "curcumin": "3%"}'),
    (turmeric_id, 'Premium (200g)', 'TU-200G', 700, 40, '{"size": "200g", "curcumin": "5%"}'),
    (turmeric_id, 'Bulk Pack (500g)', 'TU-500G', 1500, 25, '{"size": "500g", "curcumin": "5%"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Rose Water Variants
  IF rose_water_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (rose_water_id, 'Small Bottle (100ml)', 'RW-100ML', 500, 50, '{"size": "100ml", "type": "steam_distilled"}'),
    (rose_water_id, 'Medium Bottle (250ml)', 'RW-250ML', 900, 35, '{"size": "250ml", "type": "steam_distilled"}'),
    (rose_water_id, 'Spray Bottle (150ml)', 'RW-SPRAY-150', 650, 40, '{"size": "150ml", "type": "spray"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

  -- Neem Oil Variants
  IF neem_oil_id IS NOT NULL THEN
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) VALUES
    (neem_oil_id, 'Small (50ml)', 'NO-50ML', 600, 30, '{"size": "50ml", "purity": "100%"}'),
    (neem_oil_id, 'Medium (100ml)', 'NO-100ML', 950, 25, '{"size": "100ml", "purity": "100%"}'),
    (neem_oil_id, 'Large (200ml)', 'NO-200ML', 1600, 15, '{"size": "200ml", "purity": "100%"}')
    ON CONFLICT (sku) DO NOTHING;
  END IF;

END $$;

-- ============================================
-- ADDITIONAL PRODUCTS FOR DASHBOARD SECTIONS
-- ============================================

-- New Arrivals
INSERT INTO products (name, description, price, category, stock_quantity, is_organic, image_url) 
VALUES 
('Lavender Essential Oil', 'Pure organic lavender oil for aromatherapy and skincare', 1200, 'Essential Oils', 25, true, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'),
('Green Tea Face Scrub', 'Exfoliating face scrub with green tea extract', 550, 'Skincare', 40, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'),
('Charcoal Face Mask', 'Deep cleansing activated charcoal mask', 700, 'Skincare', 35, true, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500'),
('Argan Oil Hair Serum', 'Moroccan argan oil for hair repair and shine', 950, 'Haircare', 30, true, 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500')
ON CONFLICT DO NOTHING;

-- Best Sellers (Update existing products or add indicators)
-- We'll use a view or query to determine best sellers based on order data

-- Featured Products
INSERT INTO products (name, description, price, category, stock_quantity, is_organic, image_url) 
VALUES 
('Vitamin C Serum', 'Brightening vitamin C serum with hyaluronic acid', 1500, 'Skincare', 45, true, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500'),
('Herbal Hair Oil', 'Ayurvedic blend for hair growth and strength', 850, 'Haircare', 38, true, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500'),
('Natural Lip Balm Set', 'Set of 3 organic lip balms with different flavors', 450, 'Skincare', 60, true, 'https://images.unsplash.com/photo-1588112952565-c94dc6e82580?w=500'),
('Tea Tree Oil', 'Pure tea tree essential oil for acne treatment', 800, 'Essential Oils', 35, true, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500')
ON CONFLICT DO NOTHING;

-- Bulk Categories (Add more products to existing categories)
INSERT INTO products (name, description, price, category, stock_quantity, is_organic, image_url) 
VALUES 
-- More Skincare
('Retinol Night Cream', 'Anti-aging night cream with natural retinol', 1800, 'Skincare', 28, true, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500'),
('Sunscreen SPF 50', 'Natural mineral sunscreen for daily protection', 950, 'Skincare', 50, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'),
('Micellar Water', 'Gentle makeup remover with organic ingredients', 600, 'Skincare', 45, true, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500'),

-- More Haircare
('Hair Conditioner', 'Deep conditioning treatment for all hair types', 650, 'Haircare', 42, true, 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500'),
('Anti-Dandruff Serum', 'Natural serum to control dandruff and itchy scalp', 750, 'Haircare', 32, true, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500'),
('Hair Growth Oil', 'Blend of oils to promote hair growth', 900, 'Haircare', 38, true, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500'),

-- More Health Products
('Spirulina Powder', 'Organic spirulina superfood supplement', 1200, 'Health', 30, true, 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500'),
('Moringa Powder', 'Nutrient-rich moringa leaf powder', 900, 'Health', 35, true, 'https://images.unsplash.com/photo-1599009434262-c07f55a0f409?w=500'),
('Chia Seeds', 'Organic chia seeds for smoothies and cooking', 550, 'Health', 50, true, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'),
('Flax Seeds', 'Ground organic flax seeds high in omega-3', 450, 'Health', 55, true, 'https://images.unsplash.com/photo-1609907830015-602638e73bce?w=500'),

-- Essential Oils Category
('Peppermint Oil', 'Cooling peppermint essential oil', 850, 'Essential Oils', 28, true, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'),
('Eucalyptus Oil', 'Refreshing eucalyptus oil for respiratory health', 900, 'Essential Oils', 25, true, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500'),
('Rosemary Oil', 'Stimulating rosemary oil for hair and skin', 950, 'Essential Oils', 22, true, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500')
ON CONFLICT DO NOTHING;

-- ============================================
-- DASHBOARD METADATA TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS dashboard_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB, -- Store section-specific config
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dashboard_sections (section_name, title, description, display_order, config) VALUES
('company_info', 'About CheapName', 'Company information and mission statement', 1, '{"show_stats": true, "show_team": true}'),
('support', 'Customer Support', '24/7 customer support information', 2, '{"show_contact": true, "show_hours": true}'),
('best_sellers', 'Best Sellers', 'Our most popular products', 3, '{"limit": 8, "order_by": "sales_count"}'),
('featured', 'Featured Products', 'Hand-picked featured products', 4, '{"limit": 6, "show_badges": true}'),
('new_arrivals', 'New Arrivals', 'Latest additions to our collection', 5, '{"limit": 8, "days_threshold": 30}'),
('categories', 'Shop by Category', 'Browse our product categories', 6, '{"show_count": true, "min_products": 3}'),
('promotions', 'Active Promotions', 'Current deals and discounts', 7, '{"auto_apply_only": false, "show_countdown": true}')
ON CONFLICT (section_name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  config = EXCLUDED.config;

-- ============================================
-- COMPANY INFO TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS company_info (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  metadata JSONB,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO company_info (key, value, metadata) VALUES
('name', 'CheapName', '{"display": "CheapName - Organic Products"}'),
('tagline', 'Pure, Natural, Affordable', '{"subtitle": "Your trusted source for organic products"}'),
('mission', 'To provide high-quality organic products at affordable prices, making healthy living accessible to everyone.', '{}'),
('vision', 'To become the leading organic products retailer, known for quality, affordability, and customer satisfaction.', '{}'),
('founded_year', '2024', '{}'),
('total_customers', '10000', '{"increment": true}'),
('products_sold', '50000', '{"increment": true}'),
('satisfaction_rate', '98', '{"unit": "percent"}'),
('description', 'CheapName is your one-stop shop for premium organic products including skincare, haircare, health supplements, and essential oils. We source directly from certified organic farms and manufacturers to bring you the best quality at the most affordable prices.', '{}')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  metadata = EXCLUDED.metadata,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- SUPPORT INFO TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS support_info (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- email, phone, chat, hours, faq
  title VARCHAR(255),
  content TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO support_info (type, title, content, display_order, metadata) VALUES
('hours', 'Support Hours', '24/7 Customer Support Available', 1, '{"days": "Monday - Sunday", "hours": "24 hours"}'),
('email', 'Email Support', 'support@cheapname.tyo', 2, '{"response_time": "Within 2 hours"}'),
('phone', 'Phone Support', '+1 (555) 123-4567', 3, '{"available": "24/7"}'),
('chat', 'Live Chat', 'Chat with our support team', 4, '{"available": true, "avg_response": "2 minutes"}'),
('faq', 'Shipping', 'Free shipping on orders over ₹1000', 5, '{"category": "shipping"}'),
('faq', 'Returns', '30-day return policy on all products', 6, '{"category": "returns"}'),
('faq', 'Quality', 'All products are certified organic', 7, '{"category": "quality"}')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT TAGS FOR CATEGORIZATION
-- ============================================

CREATE TABLE IF NOT EXISTS product_tags (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL, -- best_seller, featured, new_arrival, trending
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_tags_unique ON product_tags(product_id, tag);

-- Tag existing products
DO $$
DECLARE
  product_rec RECORD;
BEGIN
  -- Tag best sellers (products with most sales - for now, randomly select)
  FOR product_rec IN 
    SELECT id FROM products ORDER BY RANDOM() LIMIT 8
  LOOP
    INSERT INTO product_tags (product_id, tag, priority) 
    VALUES (product_rec.id, 'best_seller', 10)
    ON CONFLICT (product_id, tag) DO NOTHING;
  END LOOP;

  -- Tag featured products
  FOR product_rec IN 
    SELECT id FROM products WHERE name IN ('Vitamin C Serum', 'Organic Face Wash', 'Honey Mask', 'Herbal Hair Oil', 'Coconut Oil', 'Tea Tree Oil')
  LOOP
    INSERT INTO product_tags (product_id, tag, priority) 
    VALUES (product_rec.id, 'featured', 8)
    ON CONFLICT (product_id, tag) DO NOTHING;
  END LOOP;

  -- Tag new arrivals (products created recently)
  FOR product_rec IN 
    SELECT id FROM products WHERE name IN ('Lavender Essential Oil', 'Green Tea Face Scrub', 'Charcoal Face Mask', 'Argan Oil Hair Serum', 'Spirulina Powder', 'Moringa Powder')
  LOOP
    INSERT INTO product_tags (product_id, tag, priority) 
    VALUES (product_rec.id, 'new_arrival', 9)
    ON CONFLICT (product_id, tag) DO NOTHING;
  END LOOP;

  -- Tag trending
  FOR product_rec IN 
    SELECT id FROM products ORDER BY RANDOM() LIMIT 6
  LOOP
    INSERT INTO product_tags (product_id, tag, priority) 
    VALUES (product_rec.id, 'trending', 7)
    ON CONFLICT (product_id, tag) DO NOTHING;
  END LOOP;
END $$;

-- ============================================
-- SAMPLE PROMOTIONS
-- ============================================

INSERT INTO promotions (name, description, code, discount_type, discount_value, min_order_amount, auto_apply, active, starts_at, ends_at, usage_limit) VALUES
('Welcome Discount', 'Get 10% off your first order', 'WELCOME10', 'percent', 10, 500, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 1000),
('Free Shipping', 'Free shipping on orders above ₹1000', 'FREESHIP', 'percent', 0, 1000, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', NULL),
('Summer Sale', 'Flat 15% off on all skincare products', 'SUMMER15', 'percent', 15, 0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days', NULL),
('Bulk Discount', 'Get ₹200 off on orders above ₹2000', 'BULK200', 'fixed', 200, 2000, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days', NULL)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- VIEWS FOR DASHBOARD QUERIES
-- ============================================

-- Best Sellers View (based on tags for now, can be updated with actual sales data)
CREATE OR REPLACE VIEW vw_best_sellers AS
SELECT 
  p.*,
  COALESCE(
    (SELECT json_agg(json_build_object('image_url', image_url, 'is_primary', is_primary) ORDER BY sort_order)
     FROM product_images WHERE product_id = p.id),
    '[]'::json
  ) as product_images,
  COALESCE(
    (SELECT json_agg(json_build_object('id', id, 'name', name, 'sku', sku, 'price', price, 'stock_quantity', stock_quantity, 'attributes', attributes))
     FROM product_variants WHERE product_id = p.id),
    '[]'::json
  ) as product_variants,
  pt.priority
FROM products p
INNER JOIN product_tags pt ON p.id = pt.product_id
WHERE pt.tag = 'best_seller'
ORDER BY pt.priority DESC, p.created_at DESC;

-- Featured Products View
CREATE OR REPLACE VIEW vw_featured_products AS
SELECT 
  p.*,
  COALESCE(
    (SELECT json_agg(json_build_object('image_url', image_url, 'is_primary', is_primary) ORDER BY sort_order)
     FROM product_images WHERE product_id = p.id),
    '[]'::json
  ) as product_images,
  COALESCE(
    (SELECT json_agg(json_build_object('id', id, 'name', name, 'sku', sku, 'price', price, 'stock_quantity', stock_quantity, 'attributes', attributes))
     FROM product_variants WHERE product_id = p.id),
    '[]'::json
  ) as product_variants,
  pt.priority
FROM products p
INNER JOIN product_tags pt ON p.id = pt.product_id
WHERE pt.tag = 'featured'
ORDER BY pt.priority DESC, p.created_at DESC;

-- New Arrivals View
CREATE OR REPLACE VIEW vw_new_arrivals AS
SELECT 
  p.*,
  COALESCE(
    (SELECT json_agg(json_build_object('image_url', image_url, 'is_primary', is_primary) ORDER BY sort_order)
     FROM product_images WHERE product_id = p.id),
    '[]'::json
  ) as product_images,
  COALESCE(
    (SELECT json_agg(json_build_object('id', id, 'name', name, 'sku', sku, 'price', price, 'stock_quantity', stock_quantity, 'attributes', attributes))
     FROM product_variants WHERE product_id = p.id),
    '[]'::json
  ) as product_variants,
  pt.priority
FROM products p
INNER JOIN product_tags pt ON p.id = pt.product_id
WHERE pt.tag = 'new_arrival'
ORDER BY pt.priority DESC, p.created_at DESC;

-- Category Stats View
CREATE OR REPLACE VIEW vw_category_stats AS
SELECT 
  category,
  COUNT(*) as product_count,
  MIN(price) as min_price,
  MAX(price) as max_price,
  AVG(price)::DECIMAL(10,2) as avg_price,
  SUM(stock_quantity) as total_stock
FROM products
WHERE category IS NOT NULL
GROUP BY category
HAVING COUNT(*) >= 3
ORDER BY product_count DESC;

-- Complete Product Details View (with images and variants)
CREATE OR REPLACE VIEW vw_products_complete AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.category,
  p.stock_quantity,
  p.is_organic,
  p.image_url,
  p.created_at,
  p.updated_at,
  COALESCE(
    (SELECT json_agg(json_build_object('image_url', image_url, 'is_primary', is_primary, 'sort_order', sort_order) ORDER BY sort_order)
     FROM product_images WHERE product_id = p.id),
    '[]'::json
  ) as product_images,
  COALESCE(
    (SELECT json_agg(json_build_object('id', id, 'name', name, 'sku', sku, 'price', price, 'stock_quantity', stock_quantity, 'attributes', attributes))
     FROM product_variants WHERE product_id = p.id),
    '[]'::json
  ) as product_variants,
  COALESCE(
    (SELECT json_agg(tag)
     FROM product_tags WHERE product_id = p.id),
    '[]'::json
  ) as tags
FROM products p
ORDER BY p.created_at DESC;

COMMIT;
