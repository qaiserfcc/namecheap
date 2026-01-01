-- Performance indexes for analytics and order lookups
-- Safe to run multiple times

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_created_at ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_promotion_id ON orders(promotion_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_order ON order_items(product_id, order_id);

-- Order events
CREATE INDEX IF NOT EXISTS idx_order_events_order_created ON order_events(order_id, created_at);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category, price);

-- Promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active_dates ON promotions(active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_promotions_code_active ON promotions(code, active);
