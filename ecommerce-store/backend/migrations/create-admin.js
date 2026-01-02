const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  let connection;
  
  try {
    console.log('🔄 Creating admin user...\n');
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'ecommerce_store'
    });
    
    console.log('✅ Connected to database');
    
    // Hash password
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@ecommerce.com']
    );
    
    if (existing.length > 0) {
      // Update existing admin
      await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'admin@ecommerce.com']
      );
      console.log('✅ Admin user updated');
    } else {
      // Create new admin
      await connection.execute(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['admin@ecommerce.com', hashedPassword, 'System', 'Administrator', 'admin', true, true]
      );
      console.log('✅ Admin user created');
    }
    
    console.log('\n📧 Email: admin@ecommerce.com');
    console.log('🔑 Password: Admin@123');
    console.log('\n⚠️  Please change this password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
