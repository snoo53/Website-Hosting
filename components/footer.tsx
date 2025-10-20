export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-8 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left section - Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="text-sm space-y-2 text-slate-300">
              <p>For inquiries: researcher@university.edu</p>
              <p>Department of Materials Science</p>
            </div>
          </div>

          {/* Right section - Data Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data Source</h3>
            <div className="text-sm space-y-2 text-slate-300">
              <p>Powered by Materials Project</p>
              <a
                href="https://materialsproject.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                materialsproject.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
