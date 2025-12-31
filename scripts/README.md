# Database Migration Scripts

## Execution Order ☕

Run these scripts in the following order to set up your Namecheap Organics database:

### 1️⃣ Initial Setup
```
01_schema.sql
```
Creates all database tables with their initial structure:
- users
- products
- orders
- order_items
- bulk_uploads
- visitor_analytics

### 2️⃣ Column Additions (Fixes)
```
04_add_missing_columns.sql
```
Adds missing columns that may not exist in older schemas:
- users.full_name
- users.phone
- products.is_organic

**Important:** Run this BEFORE inserting sample data to avoid errors.

### 3️⃣ Sample Data
```
02_sample_data.sql
```
Inserts initial data:
- Admin user (admin@namecheap.com / admin123)
- 8 sample organic products

### 4️⃣ Analytics Data (Optional)
```
03_analytics_sample_data.sql
```
Adds sample visitor analytics data for testing the admin dashboard.

---

## Quick Migration (All at Once)

You can run all migrations in order using the migration runner:

```bash
bun run scripts/run-migration.ts
```

Or manually via Neon Console:
1. Copy contents of each file in order
2. Paste into Neon SQL Editor
3. Execute

---

## Coffee Status ☕
Your virtual coffee is brewing... 🫖☕✨

Enjoy your perfectly ordered migration scripts!
