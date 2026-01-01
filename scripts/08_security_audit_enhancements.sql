-- Security and Audit Enhancements
-- Run this migration to add audit logging table

-- Create audit logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255),
  changes JSONB,
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_user_email ON audit_logs(user_email);

-- Add comment for documentation
COMMENT ON TABLE audit_logs IS 'Audit trail for all admin and user actions';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action (0 for failed auth attempts)';
COMMENT ON COLUMN audit_logs.action IS 'Type of action: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.';
COMMENT ON COLUMN audit_logs.entity IS 'Entity type: USER, PRODUCT, ORDER, PROMOTION, AUTH, SYSTEM';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN audit_logs.changes IS 'JSON object containing before/after values for updates';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional contextual information';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user';
COMMENT ON COLUMN audit_logs.user_agent IS 'Browser user agent string';

-- Create a view for recent admin actions
CREATE OR REPLACE VIEW vw_recent_admin_actions AS
SELECT 
  al.id,
  al.user_email,
  al.action,
  al.entity,
  al.entity_id,
  al.created_at,
  al.ip_address,
  u.full_name as user_name,
  u.role as user_role
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.user_id > 0
ORDER BY al.created_at DESC
LIMIT 100;

-- Create materialized view for analytics performance
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analytics_summary AS
SELECT
  -- Revenue metrics
  (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE) as revenue_today,
  (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as revenue_week,
  (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as revenue_month,
  (SELECT COALESCE(SUM(final_amount), 0) FROM orders) as revenue_total,
  
  -- Order counts
  (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE) as orders_today,
  (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as orders_week,
  (SELECT COUNT(*) FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as orders_month,
  (SELECT COUNT(*) FROM orders) as orders_total,
  
  -- Average order value
  (SELECT COALESCE(AVG(final_amount), 0) FROM orders) as avg_order_value,
  
  -- User metrics
  (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'buyer' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as new_users_month,
  
  -- Product metrics
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM products WHERE stock_quantity < 10) as low_stock_products,
  
  -- Promotion metrics
  (SELECT COUNT(*) FROM promotions WHERE active = true AND (ends_at IS NULL OR ends_at >= CURRENT_TIMESTAMP)) as active_promotions,
  
  CURRENT_TIMESTAMP as refreshed_at;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_analytics_refreshed ON mv_analytics_summary(refreshed_at);

-- Create function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_analytics_summary;
END;
$$ LANGUAGE plpgsql;

-- Add additional indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_orders_created_date ON orders(DATE(created_at));
CREATE INDEX IF NOT EXISTS idx_orders_final_amount ON orders(final_amount);
CREATE INDEX IF NOT EXISTS idx_users_created_month ON users(DATE_TRUNC('month', created_at)) WHERE role = 'buyer';
CREATE INDEX IF NOT EXISTS idx_products_stock_low ON products(stock_quantity) WHERE stock_quantity < 10;

-- Migration complete
SELECT 'Security and audit enhancements applied successfully' as status;
