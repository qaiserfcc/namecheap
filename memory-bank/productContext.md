# Product Context
- Routing: App router with `app/admin`, `app/api`, `app/auth`, `app/buyer`, and `app/checkout` segments.
- APIs: Routes for auth, products, orders, users, and bulk uploads live under `app/api`.
- Access control: `proxy.ts` middleware checks sessions and roles, redirecting unauthenticated users to login and enforcing admin-only routes.
- UI: Rich component library in `components/ui` built on Radix; feature components under `components/admin`, `components/auth`, `components/buyer`, and `components/home`.
- Data model: SQL scripts define `users`, `products`, `orders`, `order_items`, `bulk_uploads`, and `visitor_analytics`; admin user seeded with bcrypt hash.
- Assets: Product imagery stored in `public/`.
