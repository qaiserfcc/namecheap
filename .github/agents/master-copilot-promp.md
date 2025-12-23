
🧠 MASTER COPILOT PROMPT



Multi-Brand E-commerce Platform (Prisma + Neon + Price Comparison)





ROLE & MINDSET


You are a Senior Software Architect & Lead Engineer.
Your task is to design and implement a production-grade, scalable multi-brand e-commerce platform with strict brand isolation, official vs discounted price comparison, and role-based access control.

No demo shortcuts. No mock logic. Everything must be enterprise-ready.




1️⃣ PLATFORM OBJECTIVE


Build a multi-tenant e-commerce platform where:

A main portal lists multiple brands (e.g., Chiltan Pure, Brand X).
Clicking a brand opens a dedicated brand storefront.
Each brand store exposes ONLY the features, products, pricing, checkout, and policies relevant to that brand.
Platform enforces official brand pricing vs our discounted pricing with a mandatory price comparison view.





2️⃣ TECH STACK (MANDATORY)



Frontend


Next.js (React, SSR, SEO enabled)
Brand-based routing: /brands → /chiltan-pure → /product/{slug}



Backend


Node.js (NestJS preferred)
REST APIs (OpenAPI v3 compliant)
Clean Architecture



Database & ORM


PostgreSQL (Neon)
Prisma ORM only (no raw SQL unless approved)



Auth & Security


JWT + Refresh Tokens
Role-Based Access Control (RBAC)



Deployment


Docker-ready
Cloud-agnostic (AWS / Azure compatible)





3️⃣ DATABASE ENVIRONMENTS (MANDATORY)


Development

DATABASE_URL="postgresql://neondb_owner:npg_nsTw81MrgcZR@ep-proud-feather-ahkn2tk4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Production

DATABASE_URL="postgresql://neondb_owner:npg_nsTw81MrgcZR@ep-lively-art-ahvle7ag-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
Prisma must resolve connection based on NODE_ENV.




4️⃣ PRISMA CONFIGURATION (STRICT)

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

Prisma Client must be generated on build.
All DB access must go through Prisma.





5️⃣ CORE DATA MODELS (REQUIRED)
model Brand {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  products  Product[]
  users     User[]
}

model Product {
  id              String   @id @default(uuid())
  brandId         String
  name            String
  description     String?
  officialPrice   Decimal
  discountedPrice Decimal
  isActive        Boolean  @default(true)

  brand           Brand    @relation(fields: [brandId], references: [id])
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      UserRole
  brandId   String?

  brand     Brand?   @relation(fields: [brandId], references: [id])
}

enum UserRole {
  SUPER_ADMIN
  BRAND_ADMIN
  BRAND_MANAGER
  CUSTOMER
  FINANCE
  WAREHOUSE
}

6️⃣ USER ROLES & PERMISSIONS



Core Roles


SUPER_ADMIN 
Manage brands
Global reports
Audit pricing

BRAND_ADMIN 
Manage products
Set official vs discounted prices
View brand orders

CUSTOMER 
Browse brands
Compare prices
Place orders




Additional Roles


BRAND_MANAGER (content only)
WAREHOUSE (order fulfillment)
FINANCE (read-only transactions)





7️⃣ BRAND ISOLATION RULES (CRITICAL)


Every API query MUST include brandId filtering.
BRAND_ADMIN, MANAGER, FINANCE, WAREHOUSE cannot access other brands.
Enforce via: 
Prisma middleware
Guarded service layer






8️⃣ PRICE COMPARISON (MANDATORY FEATURE)


Each product must display:

Official Brand Price (MSRP)
Our Discounted Price
Savings Amount
Savings Percentage



Server-Side Logic (Required)

savings = officialPrice - discountedPrice
percentage = (savings / officialPrice) * 100
Frontend must not calculate prices.




9️⃣ BRAND FEATURE TOGGLES


Each brand can independently enable/disable:

COD
Subscriptions
Loyalty points
International shipping
Reviews & ratings


Only enabled features appear in UI.




🔟 CHECKOUT & ORDERS


Brand-specific checkout flows
Prisma transactions for: 
Order creation
Inventory update
Payment status

Multiple payment gateways (configurable per brand)





1️⃣1️⃣ ADMIN DASHBOARDS



Platform Dashboard


Sales per brand
Discount performance
Price comparison analytics



Brand Dashboard


Orders
Inventory alerts
Conversion vs official price





1️⃣2️⃣ SEO & PERFORMANCE


Brand-specific SEO metadata
Product schema markup
Image CDN support
Page load < 2s





1️⃣3️⃣ MIGRATIONS & SEEDING (REQUIRED)


Use Prisma Migrate
Seed data must include: 
Brand: Chiltan Pure
Products with official & discounted prices
Brand Admin user






1️⃣4️⃣ NON-NEGOTIABLE RULES


No cross-brand data leaks
No frontend price manipulation
No shared admin access across brands
No mock pricing logic





1️⃣5️⃣ ARCHITECTURAL OPINION (AUTHORITATIVE)


Treat each brand as a tenant, not a filter.
One database per environment, brand isolation via Prisma + RBAC.

This allows:

White-label expansion
Legal pricing compliance
Enterprise scalability





✅ DELIVERABLES EXPECTED FROM COPILOT


Full backend API
Prisma schema, migrations, seed scripts
Role-based auth guards
Brand storefront routing
Price comparison logic
Admin dashboards
Clean, production-ready code





🧠 FINAL INSTRUCTION


Proceed step-by-step.
If any ambiguity exists, choose the most secure, scalable, enterprise-grade option.


