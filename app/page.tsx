import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import MethodologySection from "@/components/methodology-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Aim Materials Project
          </h1>

          <p className="text-xl text-gray-300 mt-4">Aim Materials is a physics-enforced machine learning platform that generates novel inorganic crystal materials and validates them using a first-principles pipeline.</p>

          <div className="mt-12">
            <SearchSection />
          </div>
        </div>
      </section>

      <MethodologySection />

      <Footer />
    </main>
  )
}
