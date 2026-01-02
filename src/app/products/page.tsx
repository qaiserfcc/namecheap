import Link from 'next/link';
import { formatCurrency } from '@/lib/pricing';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  officialPrice: number;
  discountedPrice: number;
  imageUrl: string | null;
  stock: number;
  priceComparison: {
    savings: number;
    savingsPercentage: number;
  };
}

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const result = await response.json();
    return result.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products: Product[] = await getProducts();

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
                className="text-green-600 font-semibold"
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
                href="/account" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Account
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price Comparison */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(product.discountedPrice)}
                      </span>
                      {product.priceComparison.savings > 0 && (
                        <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">
                          -{product.priceComparison.savingsPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>

                    {product.priceComparison.savings > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 line-through">
                          {formatCurrency(product.officialPrice)}
                        </span>
                        <span className="text-green-600 font-medium">
                          Save {formatCurrency(product.priceComparison.savings)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3">
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
