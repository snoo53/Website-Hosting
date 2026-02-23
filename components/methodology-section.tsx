export default function MethodologySection() {
  return (
    <section className="py-12 px-4 bg-gray-900 border-t border-gray-700">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Research Methodology</h2>
        <div className="prose prose-slate max-w-none space-y-6">
          <div className="border-l-4 border-gray-500 pl-6">
            <h3 className="text-xl font-semibold text-white mb-3">Computational Approach</h3>
            <p className="text-gray-300 leading-relaxed">
              Aim Materials uses a physics-aware discovery workflow for generating and screening inorganic crystals. Candidate structures are generated across 2-, 3-, and 4-element composition spaces and subjected to structural feasibility checks. The main strategy includes symmetry-aware generative modeling and Density Functional Theory (DFT) evaluation.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              We run 1) structure optimization (variable-cell relax), 2) electronic ground-state verification (SCF), and 3) elastic response calculations for qualified cases. This design structure prevents downstream analysis from being contaminated by unconverged structures and makes the full process traceable from generated input to the final property record. All outputs are versioned, with explicit run-state labels (pending/pass/fail/non-converged/timeout), enabling publication-grade provenance and transparent reporting.
            </p>
          </div>

          <div className="border-l-4 border-gray-500 pl-6">
            <h3 className="text-xl font-semibold text-white mb-3">Data Processing</h3>
            <p className="text-gray-300 leading-relaxed">
              The data layer is designed to be consistent with Materials Project-style schemas while preserving generative-model provenance. Raw candidate outputs are normalized into canonical records with stable identifiers, reduced formulas, composition metadata, and structure payloads. We perform deduplication and integrity checks to remove malformed or repeated entries, then assemble manifests used to drive automated validation runs. Summary and elasticity fields are integrated. The result is a clean, readable dataset that supports both front-end visualization (aimmaterials.org) and backend reproducibility (MPContribs/GitHub release artifacts).
            </p>
          </div>

          <div className="border-l-4 border-gray-500 pl-6">
            <h3 className="text-xl font-semibold text-white mb-3">AI/ML Techniques</h3>
            <p className="text-gray-300 leading-relaxed">
              The generative backbone is a multimodel E(3)-equivariant graph neural network variational autoencoder (GNN-VAE) for periodic crystal representation. E(3)-equivariance ensures rotational/translational symmetries in atomic structures, improving geometric realism. The multimodel latent design captures information from both composition and structure, enabling vast and controlled exploration of chemically diverse candidates. A key methodological feature is the enforcement of Voigt symmetry during generation, aiming to ensure compatibility between predicted structures and physically meaningful elastic behavior. Candidate ranking is then performed using strict novelty- and stability-oriented filters, so high-throughput DFT resources are concentrated on the most promising structures.
            </p>
          </div>

          <div className="border-l-4 border-gray-500 pl-6">
            <h3 className="text-xl font-semibold text-white mb-3">Validation Methods</h3>
            <p className="text-gray-300 leading-relaxed">
              Validation is executed with Quantum ESPRESSO in an automated and stage-wise protocol: 1) variable-cell relaxation, 2) SCF ground-state calculation, and 3) elastic-property evaluation via strained-state calculations for qualifying materials. Each stage has explicit pass criteria and log parsing rules. Non-converged relaxations are handled by controlled rescue retries with adjusted electronic/ionic settings. This prevents false positives and yields a defensible set of validated candidates.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              Runtime metadata (timeouts, retries, stage transitions) is preserved for full auditability. For publication-level interpretation, only fully converged outputs are used for quantitative claims, while preliminary/non-converged records remain labeled as screening-only evidence. This separation supports scientific rigor, transparent communication of uncertainty, and reproducible extension in follow-up studies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
