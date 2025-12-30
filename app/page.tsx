import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import BestSellers from "@/components/home/best-sellers"
import PromoSection from "@/components/home/promo-section"
import AboutSection from "@/components/home/about-section"
import Navigation from "@/components/home/navigation"
import Footer from "@/components/home/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <PromoSection />
      <BestSellers />
      <AboutSection />
      <Footer />
    </main>
  )
}
