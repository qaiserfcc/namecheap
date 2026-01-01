-- Reviews and Wishlist Schema Migration
-- This adds essential e-commerce features for buyer experience

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  guest_name VARCHAR(255), -- For guest reviews (optional)
  guest_email VARCHAR(255), -- For guest reviews (optional)
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_user_or_guest CHECK (
    (user_id IS NOT NULL) OR 
    (guest_name IS NOT NULL AND guest_email IS NOT NULL)
  )
);

-- Review Helpful Votes (to prevent duplicate votes)
CREATE TABLE IF NOT EXISTS review_votes (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For non-logged-in users
  vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, user_id),
  UNIQUE(review_id, session_id)
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT, -- Optional notes about why they want it
  price_alert_enabled BOOLEAN DEFAULT FALSE, -- Alert when price drops
  price_threshold DECIMAL(10, 2), -- Alert when price drops below this
  UNIQUE(user_id, product_id, variant_id)
);

-- Recently Viewed Products Table
CREATE TABLE IF NOT EXISTS recently_viewed (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For non-logged-in users
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_user_or_session CHECK (
    (user_id IS NOT NULL) OR (session_id IS NOT NULL)
  )
);

-- Product Comparison Table
CREATE TABLE IF NOT EXISTS product_comparisons (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For non-logged-in users
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_comparison_user_or_session CHECK (
    (user_id IS NOT NULL) OR (session_id IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_reviews_status ON product_reviews(status);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_reviews_created ON product_reviews(created_at DESC);

CREATE INDEX idx_wishlist_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlists(product_id);
CREATE INDEX idx_wishlist_added_at ON wishlists(added_at DESC);

CREATE INDEX idx_recently_viewed_user_id ON recently_viewed(user_id);
CREATE INDEX idx_recently_viewed_session_id ON recently_viewed(session_id);
CREATE INDEX idx_recently_viewed_product_id ON recently_viewed(product_id);
CREATE INDEX idx_recently_viewed_viewed_at ON recently_viewed(viewed_at DESC);

CREATE INDEX idx_comparisons_user_id ON product_comparisons(user_id);
CREATE INDEX idx_comparisons_session_id ON product_comparisons(session_id);
CREATE INDEX idx_comparisons_product_id ON product_comparisons(product_id);

-- Add rating summary to products table (denormalized for performance)
ALTER TABLE products ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- Create function to update product rating summary
CREATE OR REPLACE FUNCTION update_product_rating_summary()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND status = 'approved'
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update rating summary
DROP TRIGGER IF EXISTS trigger_update_product_rating ON product_reviews;
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating_summary();

COMMENT ON TABLE product_reviews IS 'Stores customer reviews and ratings for products';
COMMENT ON TABLE review_votes IS 'Tracks helpful/not helpful votes on reviews';
COMMENT ON TABLE wishlists IS 'Stores user wishlist items with optional price alerts';
COMMENT ON TABLE recently_viewed IS 'Tracks recently viewed products for personalization';
COMMENT ON TABLE product_comparisons IS 'Stores products added for comparison';
