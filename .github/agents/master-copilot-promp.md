
🧠 MASTER COPILOT PROMPT

Single-Brand Serverless E-commerce Platform (Admin & Buyer) and always track progress in a file named PROGRESS.md


1️⃣ PLATFORM OBJECTIVE

Build a single-brand e-commerce platform where:
	•	One official brand storefront exists (e.g., Chiltan Pure).
	•	Buyers can browse products, compare prices, and place orders.
	•	Admin manages products, pricing, orders, and configurations.
	•	The system enforces official price vs discounted price comparison.
	•	Architecture must be serverless-first, with no long-running servers.

The system must be designed so multi-brand support can be added later without architectural rewrites.

⸻

2️⃣ TECH STACK (MANDATORY)

Frontend
	•	Next.js (React)
	•	Server Components + SSR enabled
	•	SEO-optimized routing:
	•	/
	•	/products/{slug}
	•	/cart
	•	/checkout
	•	/account
	•	/admin

Backend (Serverless)
	•	Node.js (NestJS in serverless mode or lightweight handlers)
	•	Serverless functions (Vercel / AWS Lambda / Azure Functions)
	•	REST APIs
	•	OpenAPI v3 compliant
	•	Clean Architecture adapted for serverless execution

Database & ORM
	•	PostgreSQL (Neon – Serverless)
	•	Prisma ORM only
	•	Prisma optimized for serverless usage (connection pooling via Neon)

⸻

3️⃣ AUTHENTICATION & SECURITY (MANDATORY)
	•	Neon Authentication features for user identity management
	•	JWT-based access tokens
	•	Refresh token strategy compatible with serverless execution
	•	Role-Based Access Control (RBAC) enforced at API level
	•	No session-based or in-memory auth logic

⸻

4️⃣ DATABASE ENVIRONMENTS (MANDATORY)

Prisma must resolve the database connection dynamically using NODE_ENV.

Development

DATABASE_URL="postgresql://<neon-dev-connection>"

Production

DATABASE_URL="postgresql://<neon-prod-connection>"

Serverless-safe connection handling is required at all times.

⸻

5️⃣ PRISMA CONFIGURATION (STRICT)

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

Rules:
	•	Prisma Client must be generated during build
	•	No raw SQL
	•	No shared state between invocations
	•	All DB access must go through Prisma

⸻

6️⃣ CORE DATA MODELS (REQUIRED)

model Brand {
  id        String   @id @default(uuid())
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  products  Product[]
}

model Product {
  id              String   @id @default(uuid())
  name            String
  description     String?
  officialPrice   Decimal
  discountedPrice Decimal
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      UserRole
  createdAt DateTime @default(now())
}

enum UserRole {
  ADMIN
  BUYER
}


⸻

7️⃣ USER ROLES & PERMISSIONS

ADMIN
	•	Manage products
	•	Set official and discounted prices
	•	Manage orders
	•	View sales and discount analytics
	•	Control feature toggles

BUYER
	•	Browse products
	•	View price comparison
	•	Add items to cart
	•	Checkout and place orders
	•	View order history

⸻

8️⃣ PRICE COMPARISON (MANDATORY)

Each product must display:
	•	Official Price (MSRP)
	•	Discounted Price
	•	Savings Amount
	•	Savings Percentage

Server-Side Calculation (Required)

savings = officialPrice - discountedPrice
percentage = (savings / officialPrice) * 100

⚠️ Frontend must never calculate pricing or discounts.

⸻

9️⃣ FEATURE TOGGLES (SERVERLESS-COMPATIBLE)

Admin can enable or disable:
	•	Cash on Delivery
	•	Reviews & Ratings
	•	Promotional discounts
	•	International shipping

Feature flags must be evaluated server-side and cached safely for serverless execution.

⸻

🔟 CART, CHECKOUT & ORDERS
	•	Single-brand checkout flow
	•	Serverless-safe Prisma transactions for:
	•	Order creation
	•	Inventory updates
	•	Payment status tracking
	•	Payment gateway abstraction (stateless, extensible)

⸻

1️⃣1️⃣ ADMIN DASHBOARD

Admin capabilities include:
	•	Order management
	•	Product & pricing control
	•	Discount performance analytics
	•	Revenue summaries

All admin APIs must be protected via RBAC and Neon authentication.

⸻

1️⃣2️⃣ SEO & PERFORMANCE
	•	SEO-friendly product pages
	•	Structured product schema
	•	CDN-ready image delivery
	•	Optimized for cold-start performance
	•	Page load target: < 2 seconds

⸻

1️⃣3️⃣ MIGRATIONS & SEEDING (REQUIRED)
	•	Use Prisma Migrate
	•	Seed data must include:
	•	Brand record
	•	Products with official and discounted prices
	•	One Admin user authenticated via Neon Auth

⸻

1️⃣4️⃣ NON-NEGOTIABLE RULES
	•	No frontend price manipulation
	•	No stateful server logic
	•	No insecure admin endpoints
	•	No hardcoded secrets
	•	No bypassing Neon authentication

⸻

1️⃣5️⃣ ARCHITECTURAL OPINION (AUTHORITATIVE)

This system must be treated as serverless by design, not serverless by deployment accident.

In my opinion, combining:
	•	Serverless compute
	•	Neon serverless PostgreSQL
	•	Prisma ORM
	•	RBAC

is the correct foundation for a modern, compliant, and highly scalable e-commerce platform.

⸻

✅ DELIVERABLES EXPECTED FROM COPILOT
	•	Serverless backend APIs
	•	Prisma schema, migrations, and seeds
	•	Neon-auth-integrated RBAC
	•	Buyer storefront
	•	Admin dashboard
	•	Server-side price comparison logic
	•	Production-ready, stateless code

⸻

🧠 FINAL INSTRUCTION

Proceed step by step.
When ambiguity exists, always choose the most secure, scalable, and serverless-friendly enterprise solution.

⸻
