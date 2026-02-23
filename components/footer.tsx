export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 border-t border-gray-700">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-10">
          {/* Contact & Full Paper - side by side */}
          <div className="flex flex-col md:flex-row justify-center items-start gap-16 text-left">
            {/* Contact Information */}
            <div className="space-y-6 flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Contact</h2>
              <div className="text-lg text-gray-300 space-y-3">
                <div>
                  <p>Sunwoo Lee</p>
                  <a
                    href="mailto:sunwoolee0530@gmail.com"
                    className="text-white hover:text-gray-300 transition-colors inline-block underline"
                  >
                    sunwoolee0530@gmail.com
                  </a>
                </div>
                <div className="text-sm text-gray-500 space-y-1 mt-6">
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Web Developer</p>
                  <p>Jihan Song · <a href="mailto:challengedbipolar@gmail.com" className="hover:text-gray-400 transition-colors">challengedbipolar@gmail.com</a></p>
                  <p>Gyunho Kim · <a href="mailto:ghkim887@gmail.com" className="hover:text-gray-400 transition-colors">ghkim887@gmail.com</a></p>
                </div>
              </div>
            </div>

            {/* Full Paper Link */}
            <div className="space-y-6 flex-1">
              <h3 className="text-3xl md:text-4xl font-bold text-white">Read the Full Paper</h3>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors text-lg"
              >
                Read the Full Paper
              </a>
              <p className="text-sm text-gray-400">Manuscript in preparation for submission to Computational Materials Science</p>
            </div>
          </div>

          {/* Data Source Attribution */}
          <div className="space-y-4 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold text-white">Data Sources & Acknowledgments</h3>
            <div className="text-gray-300 space-y-3 text-sm text-left">
              <p>
                Aim Materials combines three primary data streams: (1) reference crystal and property records from the Materials Project for baseline comparison and filtering, (2) element-level descriptors from the PubChem Periodic Table (NCBI) for node-feature construction, and (3) first-principles validation outputs computed with Quantum ESPRESSO (relax, SCF, and elastic stages where completed). Generated candidate structures and processed releases are versioned and shared for reproducibility through MPContribs (aim_materials_v1) and the Aim Materials GitHub repository. We acknowledge the Materials Project/MPContribs teams and the Quantum ESPRESSO developer community, as well as maintainers of key open-source scientific tools used in this work.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 pt-8">
            <p>© 2024–2026 Aim Materials | AI-Driven Materials Discovery Research Team</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
