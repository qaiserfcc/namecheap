import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  try {
    console.log('🔄 Reading migration file...');
    const migrationPath = join(__dirname, '04_add_missing_columns.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    console.log('🔄 Running migration...');
    await sql(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('✅ full_name and phone columns have been added to users table');
    
    // Verify the migration
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('full_name', 'phone')
      ORDER BY column_name;
    `;
    
    console.log('\n📊 Verification - columns in users table:');
    console.table(result);
    
    if (result.length === 2) {
      console.log('✅ Both columns exist in the database!');
    } else {
      console.log('⚠️ Warning: Expected 2 columns, found', result.length);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
