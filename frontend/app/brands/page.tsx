export default async function BrandsPage() {
  // In production, fetch from API
  const brands = [
    {
      id: '1',
      name: 'Chiltan Pure',
      slug: 'chiltan-pure',
      description: 'Natural and organic health & beauty products',
    },
    {
      id: '2',
      name: 'Brand X',
      slug: 'brand-x',
      description: 'Premium lifestyle products',
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">All Brands</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="p-6 border rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{brand.name}</h2>
              <p className="text-gray-600">{brand.description}</p>
              <span className="text-blue-600 mt-4 inline-block">
                Browse Products →
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
