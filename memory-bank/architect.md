# Architecture Notes
- App router combines frontend pages and server endpoints; API handlers reside in `app/api`.
- Session handling expected via `lib/sessions` (referenced in `proxy.ts`), which enforces auth/role checks for admin/buyer routes.
- Styling uses Tailwind CSS 4 with UI primitives in `components/ui` built on Radix and utility helpers.
- Database connectivity targets Neon PostgreSQL using provided SQL schemas; no Prisma/Nest backend is present in this workspace snapshot.

