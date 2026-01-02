import Link from 'next/link';

export default function CartPage() {
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
                className="text-dark-yellow font-semibold"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-dark-black mb-8">
          Shopping <span className="text-dark-yellow">Cart</span>
        </h1>

        <div className="card p-12 text-center border-t-4 border-sky-blue">
          <div className="text-7xl mb-6">🛒</div>
          <p className="text-2xl text-dark-black font-semibold mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-8 text-lg">Add some products to get started!</p>
          
          <Link
            href="/products"
            className="btn-primary inline-block"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 bg-gradient-to-r from-sky-blue/10 to-dark-yellow/10 border-2 border-sky-blue/30 rounded-lg p-6">
          <h3 className="font-bold text-dark-black mb-3 text-lg">Note:</h3>
          <p className="text-sm text-gray-700">
            This is a demonstration cart page. In a full implementation, this would include:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-2">
            <li>Cart state management (local storage or backend)</li>
            <li>Add/remove/update item quantities</li>
            <li>Real-time price calculations</li>
            <li>Checkout button leading to checkout flow</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
