import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              Chiltan Pure
            </Link>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Cart
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Chiltan Pure
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Premium Organic Products at Discounted Prices
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Discover our collection of natural, organic products sourced from the finest suppliers.
            Compare official prices with our discounted rates and save on every purchase.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Shop Now
            </Link>
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Compare official vs discounted prices on every product
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
            <p className="text-gray-600">
              All products are certified organic and natural
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping to your doorstep
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-20 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Technology Stack:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Next.js with Server Components</li>
                <li>PostgreSQL with Prisma ORM</li>
                <li>JWT Authentication</li>
                <li>Role-Based Access Control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Official vs Discounted Pricing</li>
                <li>Admin Dashboard</li>
                <li>Order Management</li>
                <li>Feature Toggles</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Chiltan Pure. Serverless E-commerce Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
