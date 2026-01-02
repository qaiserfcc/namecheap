import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-dark-black shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="NameCheap" className="h-12" />
            </Link>
            <div className="flex gap-6">
              <Link 
                href="/products" 
                className="text-white hover:text-dark-yellow transition-colors font-medium"
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="text-white hover:text-dark-yellow transition-colors font-medium"
              >
                Cart
              </Link>
              <Link 
                href="/admin" 
                className="text-white hover:text-dark-yellow transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-dark-black mb-6">
            Welcome to <span className="text-dark-yellow">NameCheap</span>
          </h1>
          <p className="text-2xl text-sky-blue mb-4 font-semibold">
            Premium Deals on Quality Products
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover amazing products at unbeatable prices. Compare official prices with our discounted rates 
            and save big on every purchase. Your trusted e-commerce platform for the best deals online.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              href="/products"
              className="btn-primary"
            >
              Shop Now
            </Link>
            <Link
              href="/admin"
              className="btn-secondary"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center p-8 border-t-4 border-dark-yellow">
            <div className="text-5xl mb-6">💰</div>
            <h3 className="text-2xl font-bold mb-3 text-dark-black">Best Prices</h3>
            <p className="text-gray-600 leading-relaxed">
              Compare official vs discounted prices on every product and save money
            </p>
          </div>
          <div className="card text-center p-8 border-t-4 border-sky-blue">
            <div className="text-5xl mb-6">✓</div>
            <h3 className="text-2xl font-bold mb-3 text-dark-black">Quality Assured</h3>
            <p className="text-gray-600 leading-relaxed">
              All products are verified and guaranteed for quality
            </p>
          </div>
          <div className="card text-center p-8 border-t-4 border-dark-yellow">
            <div className="text-5xl mb-6">🚚</div>
            <h3 className="text-2xl font-bold mb-3 text-dark-black">Fast Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Quick and reliable shipping directly to your doorstep
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-24 bg-gradient-to-r from-sky-blue/10 to-dark-yellow/10 border-2 border-sky-blue/30 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-dark-black">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-sky-blue mb-4 text-lg">Technology Stack:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Next.js with Server Components</li>
                <li>PostgreSQL with Prisma ORM</li>
                <li>JWT Authentication</li>
                <li>Role-Based Access Control</li>
              </ul>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-dark-yellow mb-4 text-lg">Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
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
      <footer className="bg-dark-black text-white mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/logo.svg" alt="NameCheap" className="h-10 mb-4" />
              <p className="text-gray-400">
                Your trusted e-commerce platform for premium deals.
              </p>
            </div>
            <div>
              <h4 className="text-dark-yellow font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-dark-yellow transition-colors">Products</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-dark-yellow transition-colors">Cart</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-dark-yellow transition-colors">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sky-blue font-bold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: support@namecheap.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2024 NameCheap. Serverless E-commerce Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
