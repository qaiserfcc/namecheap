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
                className="text-dark-yellow font-semibold"
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
                href="/account" 
                className="text-white hover:text-dark-yellow transition-colors font-medium"
              >
                Account
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
          Our <span className="text-dark-yellow">Products</span>
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="card overflow-hidden group border-2 border-transparent hover:border-dark-yellow transition-all"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                  {product.priceComparison.savings > 0 && (
                    <div className="absolute top-3 right-3 bg-dark-yellow text-dark-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                      -{product.priceComparison.savingsPercentage.toFixed(0)}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-dark-black mb-2 line-clamp-2 group-hover:text-dark-yellow transition-colors">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price Comparison */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-dark-yellow">
                        {formatCurrency(product.discountedPrice)}
                      </span>
                    </div>

                    {product.priceComparison.savings > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 line-through">
                          {formatCurrency(product.officialPrice)}
                        </span>
                        <span className="text-sky-blue font-semibold">
                          Save {formatCurrency(product.priceComparison.savings)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-4">
                    {product.stock > 0 ? (
                      <span className="text-xs text-white bg-sky-blue px-3 py-1.5 rounded-full font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-xs text-white bg-red-500 px-3 py-1.5 rounded-full font-medium">
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
