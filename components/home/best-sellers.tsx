import { Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const bestSellers = [
  {
    id: 1,
    name: "Premium Organic Face Serum",
    price: "$34.99",
    originalPrice: "$54.99",
    rating: 4.9,
    reviews: 892,
    image: "/organic-face-serum-premium.jpg",
    sales: "2.5K sold",
  },
  {
    id: 2,
    name: "Organic Hair Growth Oil",
    price: "$28.99",
    originalPrice: "$45.99",
    rating: 4.8,
    reviews: 645,
    image: "/organic-hair-oil-growth.jpg",
    sales: "1.8K sold",
  },
  {
    id: 3,
    name: "Natural Vitamin C Booster",
    price: "$32.99",
    originalPrice: "$52.99",
    rating: 4.9,
    reviews: 734,
    image: "/vitamin-c-booster-organic.jpg",
    sales: "3.1K sold",
  },
  {
    id: 4,
    name: "Organic Sleep & Relax Tea",
    price: "$15.99",
    originalPrice: "$24.99",
    rating: 4.7,
    reviews: 521,
    image: "/organic-herbal-tea-sleep.jpg",
    sales: "1.2K sold",
  },
]

export default function BestSellers() {
  return (
    <section id="bestsellers" className="py-20 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Top Sellers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Our Best Selling Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands, these products are proven favorites
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-border bg-background hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-b from-secondary/10 to-background">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Sales Badge */}
                <div className="absolute bottom-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  {product.sales}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-secondary transition">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4 mt-auto">
                  <span className="text-xl font-bold text-secondary">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                </div>

                {/* Button */}
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
