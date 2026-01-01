# Project Brief
- Name: Namecheap storefront/admin Next.js app.
- Description: Single Next.js 16 (React 19) app with the app router providing buyer storefront/checkout, admin dashboard, and auth flows.
- Data layer: Neon Postgres via SQL scripts (`scripts/01_schema.sql`, `scripts/02_sample_data.sql`, `scripts/03_create_admin.sql`).
- Dependencies: Next.js 16, React 19, Tailwind CSS 4, Radix UI, zod, bcryptjs, jose, Neon serverless client.
- Scope note: No separate backend directory present in this workspace; API routes live under `app/api`.

