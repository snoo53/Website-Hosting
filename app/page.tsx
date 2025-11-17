import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import MethodologySection from "@/components/methodology-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            AI-Driven Materials Discovery: A Computational Approach
          </h1>

          <p className="text-xl text-gray-300 mt-4">John Doe, Jane Smith, Alex Johnson</p>

          <div className="mt-12 max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              This research project leverages advanced machine learning algorithms to identify and characterize novel
              materials specifically suited for space engineering applications. Through our computational research, we
              have curated a database of materials with optimal properties for extreme space environments, including
              high radiation resistance, thermal stability, and structural integrity. The materials in this database
              were specifically chosen based on our AI-driven discovery process, analyzing their suitability for
              aerospace and space exploration applications.
            </p>
          </div>

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
