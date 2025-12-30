import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function PromoSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Banner */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent p-8 md:p-12 text-white min-h-80 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),rgba(255,61,113,0))]"></div>
            </div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-4">
                Limited Time
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Exclusive Member Discounts</h3>
              <p className="text-white/90 mb-6 text-lg">Get up to 40% off on all products when you sign up today</p>
            </div>

            <Link href="/auth/register">
              <Button className="bg-white text-primary hover:bg-white/90 font-bold w-fit">
                <Zap className="w-4 h-4 mr-2" />
                Claim Discount
              </Button>
            </Link>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary p-8 md:p-12 text-white min-h-80 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),rgba(255,61,113,0))]"></div>
            </div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-4">
                Free Shipping
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Orders Over $50</h3>
              <p className="text-white/90 mb-6 text-lg">Fast, eco-friendly shipping to your doorstep</p>
            </div>

            <Button className="bg-white text-secondary hover:bg-white/90 font-bold w-fit">Shop Now</Button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-card/50 backdrop-blur rounded-xl p-8 border border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground text-sm">Organic Certified</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary mb-2">30-Day</div>
            <p className="text-muted-foreground text-sm">Money Back Guarantee</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-2">40% Off</div>
            <p className="text-muted-foreground text-sm">vs Official Rates</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">24/7</div>
            <p className="text-muted-foreground text-sm">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
