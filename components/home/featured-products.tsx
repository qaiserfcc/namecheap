import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  {
    id: 1,
    name: "Organic Aloe Vera Gel",
    category: "Skincare",
    price: "$24.99",
    originalPrice: "$39.99",
    discount: "38%",
    rating: 4.8,
    reviews: 324,
    image: "/aloe-vera-gel-organic-product.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Pure Organic Honey",
    category: "Health",
    price: "$18.99",
    originalPrice: "$29.99",
    discount: "37%",
    rating: 4.9,
    reviews: 512,
    image: "/organic-honey-natural-pure.jpg",
    badge: "Featured",
  },
  {
    id: 3,
    name: "Organic Coconut Oil",
    category: "Beauty",
    price: "$22.99",
    originalPrice: "$36.99",
    discount: "38%",
    rating: 4.7,
    reviews: 289,
    image: "/coconut-oil-organic-natural.jpg",
    badge: "Featured",
  },
  {
    id: 4,
    name: "Organic Green Tea Extract",
    category: "Wellness",
    price: "$19.99",
    originalPrice: "$32.99",
    discount: "39%",
    rating: 4.6,
    reviews: 198,
    image: "/green-tea-extract-organic.jpg",
    badge: "New",
  },
]

export default function FeaturedProducts() {
  return (
    <section id="featured" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Featured Collection</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-balance">Discover Our Premium Selection</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked organic products from around the world, specially curated for your wellness journey
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-border bg-card/50 backdrop-blur hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-b from-primary/10 to-card">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {product.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                    -{product.discount}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">{product.category}</p>

                <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition">
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
                  <span className="text-xl font-bold text-primary">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                </div>

                {/* Button */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base font-semibold bg-transparent"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
