# Multi-Brand E-commerce Platform - Frontend

Next.js 15 frontend with App Router, TypeScript, and Tailwind CSS.

## Features

- ✅ Brand-based dynamic routing (/brands → /brand-slug → /product/slug)
- ✅ Server-side rendering for SEO
- ✅ Price comparison display (server-calculated only)
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Admin dashboards
- ✅ Authentication pages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **SSR**: Enabled
- **Routing**: Dynamic routes

## Installation

```bash
npm install
```

## Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── brands/
│   │   ├── [slug]/           # Brand storefront
│   │   │   └── products/
│   │   │       └── [productSlug]/  # Product detail
│   │   └── page.tsx          # Brands list
│   ├── admin/                # Admin dashboard
│   ├── auth/                 # Auth pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # UI components
│   └── layout/               # Layout components
├── lib/                      # Utilities
├── types/                    # TypeScript types
└── public/                   # Static files
```

## Routing Structure

- `/` - Home page
- `/brands` - All brands list
- `/brands/[slug]` - Brand storefront (e.g., /brands/chiltan-pure)
- `/brands/[slug]/products/[productSlug]` - Product detail
- `/admin` - Admin dashboard
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Price Comparison Display

The frontend displays server-calculated price comparison. Never calculate prices on the client side.

```tsx
// Server provides this data
{
  officialPrice: 2500,
  discountedPrice: 1999,
  priceComparison: {
    savings: 501,
    savingsPercentage: 20.04
  }
}
```

## SEO Optimization

- Server-side rendering enabled
- Dynamic metadata per page
- Structured data for products
- Brand-specific meta tags

## Styling

Tailwind CSS utility-first approach. Global styles in `app/globals.css`.

## API Integration

All API calls should use the `NEXT_PUBLIC_API_URL` environment variable:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

## Building for Production

```bash
npm run build
```

Creates an optimized production build in `.next/` directory.

## Docker

See `Dockerfile` for containerized deployment.

## License

ISC
