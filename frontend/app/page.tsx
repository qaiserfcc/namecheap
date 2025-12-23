import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Multi-Brand E-commerce Platform</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-4">Browse Brands</h2>
            <p className="text-gray-600 mb-4">
              Explore multiple brands with exclusive discounted pricing
            </p>
            <Link href="/brands" className="text-blue-600 hover:underline">
              View All Brands →
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
            <p className="text-gray-600 mb-4">
              Manage brands, products, orders, and users
            </p>
            <Link href="/admin" className="text-blue-600 hover:underline">
              Admin Dashboard →
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
            <p className="text-gray-600 mb-4">
              Access your account and track orders
            </p>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login →
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Platform Features</h3>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Multi-brand isolation with RBAC</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Official vs Discounted price comparison</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Role-based access control</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Secure JWT authentication</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Brand-specific feature toggles</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>SEO optimized storefronts</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 p-6 border-l-4 border-blue-500 bg-blue-50">
          <h4 className="font-semibold mb-2">Default Test Accounts</h4>
          <p className="text-sm text-gray-700">
            Super Admin: admin@ecommerce.com / Admin@123<br />
            Brand Admin: admin@chiltanpure.com / Admin@123<br />
            Customer: customer@example.com / Admin@123
          </p>
        </div>
      </div>
    </main>
  );
}
