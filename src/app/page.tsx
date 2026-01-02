import Link from 'next/link';
import BannerCarousel from '@/components/BannerCarousel';
import ProductCarousel from '@/components/ProductCarousel';

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

export default async function Home() {
  const products: Product[] = await getProducts();
  const featuredProducts = products.slice(0, 4);
  const bestsellerProducts = products.length > 4 ? products.slice(2, 6) : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-900">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            NameCheap
          </div>
          <nav className="flex gap-8 text-sm">
            <Link href="/" className="text-white/80 hover:text-yellow-400 transition">Home</Link>
            <Link href="/brands" className="text-white/80 hover:text-yellow-400 transition">Products</Link>
            <Link href="#about" className="text-white/80 hover:text-yellow-400 transition">About</Link>
            <Link href="/admin" className="text-white/80 hover:text-yellow-400 transition">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Banner Carousel */}
      <div className="pt-20">
        <BannerCarousel />
      </div>

      {/* About Us Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">About NameCheap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Premium domain names and products at unbeatable prices. We're committed to delivering exceptional value and service to our customers worldwide.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { label: 'Products', value: '10K+' },
            { label: 'Customers', value: '50K+' },
            { label: 'Years', value: '15+' },
            { label: 'Countries', value: '180+' }
          ].map((stat) => (
            <div key={stat.label} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center hover:border-yellow-400/50 transition">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
          <p className="text-gray-400 mb-12">Discover our most popular domain names and packages</p>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose NameCheap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Best Prices', 
                description: 'Competitive pricing with frequent discounts and special offers',
                icon: '💰'
              },
              { 
                title: '24/7 Support', 
                description: 'Our dedicated support team available round the clock',
                icon: '🎧'
              },
              { 
                title: 'Easy Management', 
                description: 'Intuitive dashboard for managing all your domains',
                icon: '⚡'
              }
            ].map((feature) => (
              <div key={feature.title} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:border-sky-400/50 hover:bg-white/20 transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">Best Sellers</h2>
          <p className="text-gray-400 mb-12">Top-selling products our customers love</p>
          <ProductCarousel products={bestsellerProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-gradient-to-r from-yellow-500/20 to-sky-500/20 border border-yellow-400/30 rounded-3xl overflow-hidden">
            <div className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-8">Join thousands of satisfied customers today</p>
              <Link href="/brands" className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition">
                Browse Products Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Powered By Modern Tech</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js', color: 'from-blue-400 to-blue-600' },
              { name: 'Prisma', color: 'from-purple-400 to-purple-600' },
              { name: 'PostgreSQL', color: 'from-emerald-400 to-emerald-600' },
              { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' }
            ].map((tech) => (
              <div key={tech.name} className={`backdrop-blur-md bg-gradient-to-br ${tech.color}/20 border border-white/20 rounded-2xl p-8 text-center hover:border-white/40 transition`}>
                <p className="text-white font-semibold">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Products', links: ['Domains', 'Hosting', 'Email'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Status'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-yellow-400 font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 NameCheap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
