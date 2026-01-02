import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  priceComparison: {
    officialPrice: number;
    discountedPrice: number;
    savings: number;
    savingsPercentage: number;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${slug}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-dark-yellow transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-dark-yellow transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-dark-black font-semibold">{product.name}</span>
          </nav>
        </div>

        <div className="card p-8 border-t-4 border-dark-yellow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-sky-blue font-semibold">by {product.brand.name}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-dark-black mb-4">
                {product.name}
              </h1>

              {/* Price Comparison Box */}
              <div className="bg-gradient-to-r from-dark-yellow/10 to-sky-blue/10 border-2 border-dark-yellow rounded-lg p-6 mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-dark-yellow">
                    {formatCurrency(product.discountedPrice)}
                  </span>
                  {product.priceComparison.savings > 0 && (
                    <span className="text-xl text-white bg-red-500 px-3 py-1 rounded-full font-bold">
                      -{product.priceComparison.savingsPercentage.toFixed(0)}% OFF
                    </span>
                  )}
                </div>

                {product.priceComparison.savings > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-semibold">Official Price:</span>
                      <span className="text-gray-500 line-through">
                        {formatCurrency(product.officialPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-sky-blue">You Save:</span>
                      <span className="text-sky-blue">
                        {formatCurrency(product.priceComparison.savings)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-sky-blue">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              {product.stock > 0 ? (
                <button className="w-full btn-primary text-lg mb-4">
                  Add to Cart
                </button>
              ) : (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-4 px-8 rounded-lg font-semibold text-lg cursor-not-allowed mb-4">
                  Out of Stock
                </button>
              )}

              {/* Description */}
              {product.description && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-dark-black mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-sm font-semibold">100% Organic</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <div className="text-sm font-semibold">Fast Delivery</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💯</div>
                  <div className="text-sm font-semibold">Quality Assured</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm font-semibold">Secure Payment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-8">
          <Link 
            href="/products"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
      </main>
    </div>
  );
}
