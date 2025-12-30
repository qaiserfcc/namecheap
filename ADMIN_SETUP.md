# Admin Account Setup Guide

## Database Setup Instructions

Your e-commerce platform uses Neon PostgreSQL for data storage. Follow these steps to set up the admin account:

### Step 1: Run the Schema Script
First, create all database tables by running the schema script:
```
scripts/01_schema.sql
```

### Step 2: Insert Sample Data and Admin User
Run the sample data script to create the admin user and sample products:
```
scripts/02_sample_data.sql
```

This script will create:
- **Admin User Account:**
  - Email: `admin@namecheap.com`
  - Password: `admin123`
  - Role: Admin (full dashboard access)

- **Sample Organic Products:** 8 sample products across Skincare, Haircare, and Health categories

## How to Execute Scripts

### Option 1: Using Vercel Dashboard
1. Go to your Neon database in Vercel
2. Open the SQL editor
3. Copy and paste the SQL script content
4. Click "Run"

### Option 2: Using Neon Dashboard Directly
1. Log in to your Neon account
2. Navigate to your project
3. Open the SQL editor
4. Paste the script and execute

## Logging In

1. Go to your website's login page
2. Use these credentials:
   - **Email:** `admin@namecheap.com`
   - **Password:** `admin123`
3. You'll be automatically redirected to the admin dashboard

## Admin Dashboard Features

Once logged in as admin, you can:
- **Dashboard:** View key metrics (orders, revenue, users, products)
- **Products:** Add, edit, and manage products
- **Orders:** View and update order statuses
- **Users:** Track visitor signups and user data
- **Bulk Upload:** Upload multiple products via CSV

## Troubleshooting

**Issue:** "Invalid credentials" error
- **Solution:** Make sure you ran `scripts/02_sample_data.sql` to create the admin user
- Verify the email is exactly: `admin@namecheap.com`
- Verify the password is exactly: `admin123`

**Issue:** "User already exists" when running the script
- **Solution:** This is normal. The script uses `ON CONFLICT DO NOTHING` to prevent duplicates
- If you need to reset the password, delete the user row and run the script again

**Issue:** Can't find the database URL
- Go to your Vercel project settings
- Check the "Integrations" or "Environment Variables" tab for `DATABASE_URL`
