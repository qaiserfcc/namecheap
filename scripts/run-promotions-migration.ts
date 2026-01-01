import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log('🔄 Running promotions/variants migration...');
  
  const statements = [
    `CREATE TABLE IF NOT EXISTS promotions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      code VARCHAR(100) UNIQUE,
      auto_apply BOOLEAN DEFAULT FALSE,
      discount_type VARCHAR(20) NOT NULL DEFAULT 'percent',
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
    );`,
    `CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);`,
    `CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(starts_at, ends_at);`,
    `CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);`,
    `CREATE TABLE IF NOT EXISTS product_variants (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(255) UNIQUE,
      price DECIMAL(10,2),
      stock_quantity INT DEFAULT 0,
      attributes JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);`,
    `CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);`,
    `CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary DESC, sort_order);`,
    `CREATE TABLE IF NOT EXISTS order_events (
      id SERIAL PRIMARY KEY,
      order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      note TEXT,
      created_by INT REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);`,
  ];

  const alterStatements = [
    { name: 'promotion_id', sql: `ALTER TABLE orders ADD COLUMN promotion_id INT REFERENCES promotions(id);` },
    { name: 'promotion_code', sql: `ALTER TABLE orders ADD COLUMN promotion_code VARCHAR(100);` },
    { name: 'discount_amount', sql: `ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;` },
    { name: 'final_amount', sql: `ALTER TABLE orders ADD COLUMN final_amount DECIMAL(10,2) DEFAULT 0;` },
    { name: 'tracking_number', sql: `ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(255);` },
    { name: 'shipping_provider', sql: `ALTER TABLE orders ADD COLUMN shipping_provider VARCHAR(255);` },
    { name: 'expected_delivery', sql: `ALTER TABLE orders ADD COLUMN expected_delivery DATE;` },
    { name: 'notes', sql: `ALTER TABLE orders ADD COLUMN notes TEXT;` },
  ];

  try {
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    console.log('✅ Created tables and indexes');

    // Check and add order columns
    const orderCols = await sql.query(`SELECT column_name FROM information_schema.columns WHERE table_name='orders'`);
    const existingCols = orderCols.map((c: any) => c.column_name);

    for (const { name, sql: alterSql } of alterStatements) {
      if (!existingCols.includes(name)) {
        await sql.query(alterSql);
        console.log(`✅ Added column: ${name}`);
      } else {
        console.log(`⏭️  Column ${name} already exists`);
      }
    }

    // Backfill final_amount
    await sql.query(`UPDATE orders SET final_amount = COALESCE(final_amount, total_amount) WHERE final_amount IS NULL OR final_amount = 0;`);
    console.log('✅ Backfilled final_amount');

    console.log('\n🎉 Migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
