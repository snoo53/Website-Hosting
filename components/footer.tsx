function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

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
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-2 font-semibold">Founder & Research Lead</p>
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

              <div className="pt-3">
                <h4 className="text-lg md:text-xl font-semibold text-white mb-3">GitHub Repositories</h4>
                <div className="space-y-2">
                  <a
                    href="https://github.com/snoo53/Aim-Materials"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Aim Materials GitHub repository"
                    title="Aim Materials GitHub repository"
                    className="group flex items-center gap-3 rounded-lg border border-gray-600 bg-gray-800/60 px-3 py-2 hover:border-blue-400 hover:bg-gray-800 transition-colors w-fit"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-gray-200 text-gray-900 rounded-md group-hover:bg-white transition-colors">
                      <GitHubIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm text-gray-200 group-hover:text-white">Aim Materials</span>
                  </a>
                  <a
                    href="https://github.com/snoo53/Website-Hosting"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Aim Materials website hosting GitHub repository"
                    title="Aim Materials website hosting GitHub repository"
                    className="group flex items-center gap-3 rounded-lg border border-gray-600 bg-gray-800/60 px-3 py-2 hover:border-blue-400 hover:bg-gray-800 transition-colors w-fit"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-gray-200 text-gray-900 rounded-md group-hover:bg-white transition-colors">
                      <GitHubIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm text-gray-200 group-hover:text-white">Website Hosting</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Full Paper Link */}
            <div className="space-y-6 flex-1">
              <h3 className="text-3xl md:text-4xl font-bold text-white">Read the Full Paper</h3>
              <a
                href="/papers/aim-materials-jmst-manuscript.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center rounded-lg border border-gray-600 bg-gray-800/60 px-4 py-3 hover:border-blue-400 hover:bg-gray-800 transition-colors w-fit"
              >
                <span className="text-base font-medium text-gray-200 group-hover:text-white">Read the Full Paper</span>
              </a>
              <p className="text-xs text-gray-500">PDF · preprint-style manuscript</p>
              <p className="text-sm text-gray-400">Manuscript submitted to the Journal of Materials Science &amp; Technology.</p>

              <h3 className="text-3xl md:text-4xl font-bold text-white pt-4">Materials Project Dataset</h3>
              <a
                href="https://contribs.materialsproject.org/projects/aim_materials_v1"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center rounded-lg border border-gray-600 bg-gray-800/60 px-4 py-3 hover:border-blue-400 hover:bg-gray-800 transition-colors w-fit"
              >
                <span className="text-base font-medium text-gray-200 group-hover:text-white">Explore on Materials Project</span>
              </a>
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
