# System Patterns
- Next.js app router structure with page/layout files per route segment.
- API endpoints co-located under `app/api` for auth, orders, products, users, and bulk uploads.
- Role-based routing guard via middleware (`proxy.ts`) performing session verification and role checks.
- UI components follow Radix-based patterns in `components/ui`; forms typically use react-hook-form with zod validation.
- Tailwind CSS 4 provides utility-first styling across pages and components.
