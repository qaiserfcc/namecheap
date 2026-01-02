import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
                className="text-green-600 font-semibold"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-8">Add some products to get started!</p>
          
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Note:</h3>
          <p className="text-sm text-gray-700">
            This is a demonstration cart page. In a full implementation, this would include:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
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
