export default async function BrandPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // In production, fetch from API
  const brand = {
    name: slug === 'chiltan-pure' ? 'Chiltan Pure' : 'Brand X',
    slug,
    description: 'Natural and organic products',
  };

  const products = [
    {
      id: '1',
      name: 'Organic Argan Oil',
      slug: 'organic-argan-oil',
      officialPrice: 2500,
      discountedPrice: 1999,
      savings: 501,
      savingsPercentage: 20.04,
    },
    {
      id: '2',
      name: 'Natural Rose Water',
      slug: 'natural-rose-water',
      officialPrice: 1200,
      discountedPrice: 899,
      savings: 301,
      savingsPercentage: 25.08,
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
          <p className="text-gray-600">{brand.description}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Products</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 line-through">
                      PKR {product.officialPrice}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Save {product.savingsPercentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      PKR {product.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-600">
                      Save PKR {product.savings}
                    </span>
                  </div>
                </div>

                <a
                  href={`/brands/${slug}/products/${product.slug}`}
                  className="mt-4 block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
