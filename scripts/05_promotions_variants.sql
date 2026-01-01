-- Migration: promotions, product variants/images, order tracking
-- Safe for re-run with IF NOT EXISTS and conditional adds

-- Promotions table (supports code or auto-apply)
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100) UNIQUE,
  auto_apply BOOLEAN DEFAULT FALSE,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percent', -- percent | fixed
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  product_ids INT[] DEFAULT '{}',
  category VARCHAR(100),
  starts_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  max_discount DECIMAL(10,2),
  stackable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);

-- Product variants (per-product SKUs with pricing/stock deltas)
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE,
  price DECIMAL(10,2), -- optional override; if NULL, use base product price
  stock_quantity INT DEFAULT 0,
  attributes JSONB, -- arbitrary key/value attributes (e.g., size, color)
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Product images (multi-image support)
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary DESC, sort_order);

-- Order tracking + promotions on orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='promotion_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN promotion_id INT REFERENCES promotions(id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='promotion_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN promotion_code VARCHAR(100);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='discount_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='final_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN final_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(255);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_provider'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_provider VARCHAR(255);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='expected_delivery'
  ) THEN
    ALTER TABLE orders ADD COLUMN expected_delivery DATE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='notes'
  ) THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_number VARCHAR(50) UNIQUE;
  END IF;
END $$;

-- Add product_name to order_items for historical tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='product_name'
  ) THEN
    ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255);
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='subtotal'
    ) THEN
      ALTER TABLE order_items ADD COLUMN subtotal NUMERIC(10,2);
    END IF;
  END IF;
END $$;

-- Order events for manual tracking history
CREATE TABLE IF NOT EXISTS order_events (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  note TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);

-- Ensure final_amount defaults to total_amount on existing rows
UPDATE orders SET final_amount = COALESCE(final_amount, total_amount) WHERE final_amount IS NULL;
