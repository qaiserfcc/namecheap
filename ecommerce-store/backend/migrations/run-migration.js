const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Starting database migration...\n');
    
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sql = await fs.readFile(sqlFilePath, 'utf8');
    
    console.log('📄 Read migration file: init.sql');
    
    // Execute SQL statements
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Database schema created:');
    console.log('   - users');
    console.log('   - categories');
    console.log('   - products');
    console.log('   - cart');
    console.log('   - orders');
    console.log('   - order_items');
    console.log('\n🌱 Sample data inserted');
    console.log('\nℹ️  Note: Default admin password needs to be updated in the database');
    console.log('   Run: node migrations/create-admin.js');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
