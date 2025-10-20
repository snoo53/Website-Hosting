import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import MethodologySection from "@/components/methodology-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
            AI-Driven Materials Discovery: A Computational Approach
          </h1>

          <p className="text-xl text-slate-300 mt-4">John Doe, Jane Smith, Alex Johnson</p>

          <div className="mt-8 h-64 md:h-96 rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />

          <div className="mt-12 max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 leading-relaxed">
              This research project leverages advanced machine learning algorithms to identify and characterize novel
              materials specifically suited for space engineering applications. By analyzing computational data from
              thousands of candidate materials, we aim to accelerate the discovery of compounds with optimal properties
              for extreme space environments, including high radiation resistance, thermal stability, and structural
              integrity.
            </p>
          </div>
        </div>
      </section>

      <SearchSection />

      <MethodologySection />

      <Footer />
    </main>
  )
}
