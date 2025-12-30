import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Zap } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background pt-20 pb-20 md:pt-32 md:pb-32">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">100% Organic & Natural</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
              Pure Organic
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Wellness
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover premium organic products curated for your health and beauty. Enjoy exclusive discounts up to 40%
              off official retail rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto px-8 py-3 text-base font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link href="#about">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10 w-full sm:w-auto px-8 py-3 text-base font-semibold bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6">
              <div>
                <div className="text-2xl font-bold text-secondary">10K+</div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Organic Certified</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">24/7</div>
                <p className="text-sm text-muted-foreground">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-secondary/10 rounded-2xl overflow-hidden">
              <img src="/organic-beauty-products-natural-skincare.jpg" alt="Organic Products" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
