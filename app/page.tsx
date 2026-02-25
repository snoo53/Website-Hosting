import Image from "next/image"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import MethodologySection from "@/components/methodology-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <header className="px-6 py-3">
        <div className="flex items-center gap-3">
          <Image src="/my-project-page-1 (1).png" alt="Aim Materials Logo" width={36} height={36} className="rounded" />
          <span className="text-white font-semibold text-lg tracking-wide">Aim Materials</span>
        </div>
      </header>

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
