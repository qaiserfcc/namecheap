export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string; productSlug: string }> 
}) {
  const { slug, productSlug } = await params;
  
  // In production, fetch from API
  const product = {
    name: 'Organic Argan Oil',
    description: 'Pure organic argan oil for hair and skin. Rich in vitamins and antioxidants.',
    officialPrice: 2500,
    discountedPrice: 1999,
    savings: 501,
    savingsPercentage: 20.04,
    stock: 100,
    sku: 'CP-ARG-001',
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4 text-lg">Price Comparison</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Official Brand Price:</span>
                  <span className="font-semibold line-through text-gray-500">
                    PKR {product.officialPrice}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Our Discounted Price:</span>
                  <span className="font-bold text-2xl text-blue-600">
                    PKR {product.discountedPrice}
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-green-700 font-semibold">You Save:</span>
                    <span className="font-bold text-green-600">
                      PKR {product.savings} ({product.savingsPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              <p className="text-sm text-green-600">In Stock: {product.stock} units</p>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
