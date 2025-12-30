import { Check, Award, Leaf, Heart } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-secondary/10 to-accent/10 rounded-2xl overflow-hidden">
              <img
                src="/natural-organic-wellness-lifestyle-healthy-living.jpg"
                alt="About Namecheap Organics"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              About Namecheap Organics
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Pure Quality, Better Prices</h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              At Namecheap Organics, we believe that premium organic products shouldn't come with premium prices. We
              work directly with organic farms and manufacturers worldwide to bring you authentic, certified organic
              products at unbeatable prices.
            </p>

            {/* Why Choose Us */}
            <div className="space-y-4 mb-10">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Leaf className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">100% Certified Organic</h3>
                  <p className="text-muted-foreground">
                    Every product is certified organic and sourced from trusted suppliers
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">40% Lower Than Official Rates</h3>
                  <p className="text-muted-foreground">
                    Direct supplier partnerships allow us to offer exclusive discounts you won't find anywhere else
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Customer First Approach</h3>
                  <p className="text-muted-foreground">
                    30-day money-back guarantee and 24/7 support ensures your satisfaction
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Eco-Friendly Packaging</h3>
                  <p className="text-muted-foreground">
                    Sustainable, recyclable packaging to protect both your products and our planet
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
