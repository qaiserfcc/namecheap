"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Star, 
  Zap, 
  Package, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Truck, 
  HeadphonesIcon, 
  Users,
  Award
} from "lucide-react"

interface ProductImage {
  image_url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

interface ProductVariant {
  sku: string
  price_override?: number
  stock_quantity: number
  attributes: Record<string, any>
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  stock_quantity?: number
  image_url?: string
  product_images?: ProductImage[]
  product_variants?: ProductVariant[]
  is_best_seller?: boolean
  is_featured?: boolean
  is_new_arrival?: boolean
  variant_count?: number
  rating?: number
}

interface Promotion {
  id: number
  code: string
  discount_type: string
  discount_value: number
  description: string
  auto_apply: boolean
}

interface CompanyInfo {
  name: string
  tagline: string
  mission: string
  vision: string
  founded_year: number
  total_customers: number
  products_sold: number
  satisfaction_rate: number
}

interface SupportInfo {
  contact_type: string
  contact_value: string
  is_available_24_7: boolean
  description: string
}

interface Category {
  category: string
  product_count: number
  min_price: number
  max_price: number
  avg_price: number
}

interface DashboardData {
  company: CompanyInfo
  support: SupportInfo[]
  bestSellers: Product[]
  featured: Product[]
  newArrivals: Product[]
  categories: Category[]
  promotions: Promotion[]
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  // Find primary image or use first image
  const primaryImage = product.product_images?.find(img => img.is_primary) 
    || product.product_images?.[0]
  const imageUrl = primaryImage?.image_url || product.image_url || '/placeholder.jpg'
  const altText = primaryImage?.alt_text || product.name

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.is_new_arrival && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              NEW
            </div>
          )}
          {product.is_best_seller && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              BEST SELLER
            </div>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Only {product.stock} left!
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 4.5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.rating || 4.5})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
            {product.variant_count && product.variant_count > 1 && (
              <span className="text-xs text-gray-500">{product.variant_count} variants</span>
            )}
          </div>
          {product.stock === 0 ? (
            <Button variant="outline" className="w-full mt-3" disabled>
              Out of Stock
            </Button>
          ) : (
            <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700">
              View Details
            </Button>
          )}
        </div>
      </Link>
    </Card>
  )
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const company = dashboardData?.company
  const support = dashboardData?.support || []
  const promotions = dashboardData?.promotions || []
  const categories = dashboardData?.categories || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section with Company Stats */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                {company?.name || "CheapName"}
              </h1>
              <p className="text-2xl text-emerald-600 mb-6">
                {company?.tagline || "Pure, Natural, Affordable"}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {company?.mission || "Providing high-quality natural products at affordable prices"}
              </p>
              <div className="flex gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                <Users className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                <div className="text-3xl font-bold text-emerald-600">
                  {company?.total_customers?.toLocaleString() || "10,000+"}
                </div>
                <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <Package className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600">
                  {company?.products_sold?.toLocaleString() || "50,000+"}
                </div>
                <div className="text-sm text-gray-600 mt-1">Products Sold</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-3xl font-bold text-orange-600">
                  {company?.satisfaction_rate || 98}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Satisfaction Rate</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-white border-purple-200">
                <Sparkles className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600">
                  {new Date().getFullYear() - (company?.founded_year || 2024)}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Years of Trust</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Active Promotions */}
        {promotions.length > 0 && (
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Zap className="h-6 w-6" />
                <h2 className="text-3xl font-bold">Active Promotions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {promotions.map((promo) => (
                  <Card key={promo.id} className="p-6 bg-white/10 backdrop-blur border-white/20 text-white">
                    <div className="text-2xl font-bold mb-2">{promo.code}</div>
                    <div className="text-lg mb-2">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `₹${promo.discount_value} OFF`}
                    </div>
                    <div className="text-sm opacity-90">{promo.description}</div>
                    {promo.auto_apply && (
                      <div className="mt-3 text-xs bg-green-500 inline-block px-2 py-1 rounded">
                        Auto-applies at checkout
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {dashboardData?.bestSellers && dashboardData.bestSellers.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <h2 className="text-4xl font-bold">Best Sellers</h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/products?filter=best-sellers">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {dashboardData?.featured && dashboardData.featured.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-4xl font-bold">Featured Products</h2>
                </div>
                <Button asChild variant="outline">
                  <Link href="/products?filter=featured">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.featured.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {dashboardData?.newArrivals && dashboardData.newArrivals.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-green-600" />
                <h2 className="text-4xl font-bold">New Arrivals</h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/products?filter=new-arrivals">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Shop by Category */}
        {categories.length > 0 && (
          <section id="categories" className="bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
                <p className="text-lg text-gray-600">Explore our wide range of products</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <Link key={cat.category} href={`/products?category=${cat.category}`}>
                    <Card className="p-8 text-center hover:shadow-xl transition-all group cursor-pointer h-full">
                      <div className="text-6xl mb-4">
                        {cat.category === 'Skincare' && '🧴'}
                        {cat.category === 'Haircare' && '💆'}
                        {cat.category === 'Health' && '💊'}
                        {cat.category === 'Essential Oils' && '🌿'}
                        {!['Skincare', 'Haircare', 'Health', 'Essential Oils'].includes(cat.category) && '📦'}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                        {cat.category}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {cat.product_count} {cat.product_count === 1 ? 'product' : 'products'}
                      </p>
                      <p className="text-sm text-gray-500">
                        From ₹{Math.round(cat.min_price)} to ₹{Math.round(cat.max_price)}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Company Info & Support Section */}
        <section className="bg-emerald-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Company Info */}
              {company && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">About {company.name}</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-600 mb-2">Our Mission</h3>
                      <p className="text-gray-700">{company.mission}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-600 mb-2">Our Vision</h3>
                      <p className="text-gray-700">{company.vision}</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-600">
                        Serving customers since {company.founded_year}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Info */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Customer Support</h2>
                <div className="space-y-4">
                  {support.map((item, idx) => (
                    <Card key={idx} className="p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <HeadphonesIcon className="h-6 w-6 text-emerald-600 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1 capitalize">{item.contact_type}</h3>
                          <p className="text-gray-700">{item.contact_value}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          {item.is_available_24_7 && (
                            <p className="text-xs text-green-600 mt-1 font-semibold">Available 24/7</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-100 p-4 rounded-full mb-3">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">100% Organic</h3>
              <p className="text-sm text-gray-600">Natural ingredients</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over ₹1000</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-4 rounded-full mb-3">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1">30-Day Guarantee</h3>
              <p className="text-sm text-gray-600">Money back guarantee</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-3">
                <HeadphonesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {company?.name || "CheapName"}
                </h3>
                <p className="text-gray-400">
                  {company?.tagline || "Pure, Natural, Affordable"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/products" className="hover:text-white">Products</Link></li>
                  <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
                  <li><Link href="#categories" className="hover:text-white">Categories</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  {categories.slice(0, 4).map(cat => (
                    <li key={cat.category}>
                      <Link href={`/products?category=${cat.category}`} className="hover:text-white">
                        {cat.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  {support.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item.contact_value}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} {company?.name || "CheapName"}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
