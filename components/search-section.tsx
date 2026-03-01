"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import materialsData from "@/lib/data/materials.json"

interface Material {
  material_id: string
  formula_pretty: string
  elements: string[]
  chemsys: string
  density: number
  volume: number
  nsites: number
  nelements: number
  symmetry: {
    crystal_system: string
    point_group?: string
    symbol?: string
    number?: number
  }
  universal_anisotropy: number
  homogeneous_poisson: number
  deprecated: boolean
  elasticity: {
    fitting_method: string
    bulk_modulus: { vrh: number } | null
    shear_modulus: { vrh: number } | null
    young_modulus: number | { vrh?: number | null } | null
  } | null
  qe_validation?: {
    status: string
    relax_converged: boolean
    scf_converged: boolean
    dft_has_elastic: boolean
    dft_B_H: number | null
    dft_G_H: number | null
    dft_E_H: number | null
    dft_nu_H: number | null
    dft_A_U: number | null
  }
}

function getYoungModulusVrh(
  elasticity: Material["elasticity"],
): number | null {
  const rawYoung = elasticity?.young_modulus
  if (typeof rawYoung === "number") return rawYoung
  if (rawYoung && typeof rawYoung === "object" && typeof rawYoung.vrh === "number") {
    return rawYoung.vrh
  }
  return null
}

function FilterSlider({
  label,
  range,
  onRangeChange,
  min,
  max,
  step,
  decimalPlaces = 0,
  formatTooltip,
}: {
  label: string
  range: [number, number]
  onRangeChange: (v: [number, number]) => void
  min: number
  max: number
  step: number
  decimalPlaces?: number
  formatTooltip?: (v: number) => string
}) {
  const fmt = (v: number) => (decimalPlaces > 0 ? v.toFixed(decimalPlaces) : String(v))
  const [minText, setMinText] = useState(() => fmt(range[0]))
  const [maxText, setMaxText] = useState(() => fmt(range[1]))
  const [minFocused, setMinFocused] = useState(false)
  const [maxFocused, setMaxFocused] = useState(false)

  useEffect(() => { if (!minFocused) setMinText(fmt(range[0])) }, [range[0]])
  useEffect(() => { if (!maxFocused) setMaxText(fmt(range[1])) }, [range[1]])

  const snap = (v: number) => parseFloat((Math.round(v / step) * step).toFixed(10))

  const commitMin = (text: string) => {
    const num = parseFloat(text)
    if (isNaN(num)) { setMinText(fmt(range[0])); return }
    const val = Math.min(snap(Math.max(min, Math.min(max, num))), range[1])
    onRangeChange([val, range[1]])
  }

  const commitMax = (text: string) => {
    const num = parseFloat(text)
    if (isNaN(num)) { setMaxText(fmt(range[1])); return }
    const val = Math.max(snap(Math.max(min, Math.min(max, num))), range[0])
    onRangeChange([range[0], val])
  }

  const inputCls = "w-14 bg-gray-600 border border-gray-500 text-white text-xs px-1 py-0.5 rounded text-center focus:border-blue-500 focus:outline-none"

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs font-medium text-gray-200">{label}</Label>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={minText}
            onChange={(e) => setMinText(e.target.value)}
            onFocus={() => setMinFocused(true)}
            onBlur={(e) => { setMinFocused(false); commitMin(e.target.value) }}
            onKeyDown={(e) => { if (e.key === "Enter") { commitMin(minText); (e.target as HTMLInputElement).blur() } }}
            className={inputCls}
          />
          <span className="text-gray-500 text-xs">–</span>
          <input
            type="text"
            value={maxText}
            onChange={(e) => setMaxText(e.target.value)}
            onFocus={() => setMaxFocused(true)}
            onBlur={(e) => { setMaxFocused(false); commitMax(e.target.value) }}
            onKeyDown={(e) => { if (e.key === "Enter") { commitMax(maxText); (e.target as HTMLInputElement).blur() } }}
            className={inputCls}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={range}
        onValueChange={(v) => onRangeChange(v as [number, number])}
        formatValue={formatTooltip}
      />
    </div>
  )
}

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [densityRange, setDensityRange] = useState<[number, number]>([0, 15])
  const [volumeRange, setVolumeRange] = useState<[number, number]>([0, 1300])
  const [bulkModulusRange, setBulkModulusRange] = useState<[number, number]>([0, 9000])
  const [shearModulusRange, setShearModulusRange] = useState<[number, number]>([0, 4000])
  const [poissonRange, setPoissonRange] = useState<[number, number]>([0, 0.5])
  const [crystalSystem, setCrystalSystem] = useState<string>("all")
  const [randomMaterial, setRandomMaterial] = useState<Material | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const materials = materialsData as Material[]

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        searchQuery === "" ||
        material.material_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.formula_pretty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.chemsys.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.elements.some((el) => el.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesDensity = material.density >= densityRange[0] && material.density <= densityRange[1]

      const matchesVolume = material.volume >= volumeRange[0] && material.volume <= volumeRange[1]

      const bulkVrh = material.elasticity?.bulk_modulus?.vrh ?? null
      const matchesBulkModulus =
        bulkVrh === null ||
        (bulkVrh >= bulkModulusRange[0] && bulkVrh <= bulkModulusRange[1])

      const shearVrh = material.elasticity?.shear_modulus?.vrh ?? null
      const matchesShearModulus =
        shearVrh === null ||
        (shearVrh >= shearModulusRange[0] && shearVrh <= shearModulusRange[1])

      const matchesPoisson =
        material.homogeneous_poisson >= poissonRange[0] && material.homogeneous_poisson <= poissonRange[1]

      const matchesCrystalSystem = crystalSystem === "all" || material.symmetry.crystal_system === crystalSystem

      return matchesSearch && matchesDensity && matchesVolume && matchesBulkModulus &&
             matchesShearModulus && matchesPoisson && matchesCrystalSystem
    })
  }, [searchQuery, densityRange, volumeRange, bulkModulusRange, shearModulusRange, poissonRange, crystalSystem, materials])

  const crystalSystems = useMemo(() => {
    const systems = new Set(materials.map((m) => m.symmetry.crystal_system))
    return Array.from(systems).sort()
  }, [materials])

  const handleFeelingLucky = () => {
    const randomIndex = Math.floor(Math.random() * materials.length)
    setRandomMaterial(materials[randomIndex])
    setHasSearched(true)
  }

  const toggleExpanded = (materialId: string) => {
    setExpandedMaterials((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(materialId)) {
        newSet.delete(materialId)
      } else {
        newSet.add(materialId)
      }
      return newSet
    })
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    densityRange[0] !== 0 || densityRange[1] !== 15 ||
    volumeRange[0] !== 0 || volumeRange[1] !== 1300 ||
    bulkModulusRange[0] !== 0 || bulkModulusRange[1] !== 9000 ||
    shearModulusRange[0] !== 0 || shearModulusRange[1] !== 4000 ||
    poissonRange[0] !== 0 || poissonRange[1] !== 0.5 ||
    crystalSystem !== "all"

  const shouldShowResults = true

  useEffect(() => { setShowAll(false) }, [filteredMaterials])

  const displayMaterials = randomMaterial ? [randomMaterial] : (showAll ? filteredMaterials : filteredMaterials.slice(0, 3))

  return (
    <div className="w-full bg-gray-800 py-8 rounded-lg text-left">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Search Materials Database</h2>

        {/* Search bar — full width */}
        <div className="bg-gray-700 rounded-lg border-2 border-gray-600 p-6 mb-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by material ID, formula, element, or chemical system..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setRandomMaterial(null)
                  setHasSearched(true)
                }}
                className="pl-10 bg-gray-600 border-2 border-gray-500 text-white placeholder:text-gray-400 focus:border-blue-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={handleFeelingLucky}
              className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-500"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Feeling Lucky?
            </Button>
          </div>
        </div>

        {/* Found n materials — full width above filter+results */}
        {shouldShowResults && (
          <div className="text-white text-center mb-4">
            {randomMaterial ? (
              <p className="text-lg"><span className="font-bold">Random Material Selected</span></p>
            ) : (
              <p className="text-lg">
                Found <span className="font-bold">{filteredMaterials.length}</span> materials
                {!showAll && filteredMaterials.length > 3 && " (showing first 3)"}
              </p>
            )}
          </div>
        )}

        {/* Filter panel + Results */}
        <div className="relative">
          {showFilters && (
            <div className="w-full bg-gray-700 rounded-lg border-2 border-gray-600 p-3 space-y-2 max-h-[420px] overflow-y-auto mb-4 md:mb-0 md:w-64 md:absolute md:top-0 md:left-0 md:-translate-x-[calc(100%+1rem)] md:z-20">
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">Summary Scalars</h3>
                <div className="space-y-2">
                  <FilterSlider
                    label="Density (g/cm³)"
                    range={densityRange}
                    onRangeChange={(v) => { setDensityRange(v); setRandomMaterial(null); setHasSearched(true) }}
                    min={0} max={15} step={0.1} decimalPlaces={1}
                    formatTooltip={(v) => `${v.toFixed(1)} g/cm³`}
                  />
                  <FilterSlider
                    label="Volume (Ų)"
                    range={volumeRange}
                    onRangeChange={(v) => { setVolumeRange(v); setRandomMaterial(null); setHasSearched(true) }}
                    min={0} max={1300} step={1}
                    formatTooltip={(v) => `${v} Ų`}
                  />
                </div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">Elastic Properties</h3>
                <div className="space-y-2">
                  <FilterSlider
                    label="Bulk Modulus (GPa)"
                    range={bulkModulusRange}
                    onRangeChange={(v) => { setBulkModulusRange(v); setRandomMaterial(null); setHasSearched(true) }}
                    min={0} max={9000} step={10}
                    formatTooltip={(v) => `${v} GPa`}
                  />
                  <FilterSlider
                    label="Shear Modulus (GPa)"
                    range={shearModulusRange}
                    onRangeChange={(v) => { setShearModulusRange(v); setRandomMaterial(null); setHasSearched(true) }}
                    min={0} max={4000} step={10}
                    formatTooltip={(v) => `${v} GPa`}
                  />
                  <FilterSlider
                    label="Poisson's Ratio"
                    range={poissonRange}
                    onRangeChange={(v) => { setPoissonRange(v); setRandomMaterial(null); setHasSearched(true) }}
                    min={0} max={0.5} step={0.01} decimalPlaces={2}
                    formatTooltip={(v) => v.toFixed(2)}
                  />
                </div>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">Crystal Structure</h3>
                <Label className="text-xs font-medium mb-1 block text-gray-200">Crystal System</Label>
                <Select
                  value={crystalSystem}
                  onValueChange={(value) => { setCrystalSystem(value); setRandomMaterial(null); setHasSearched(true) }}
                >
                  <SelectTrigger className="bg-gray-600 border-2 border-gray-500 text-white focus:border-blue-500 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Systems</SelectItem>
                    {crystalSystems.map((system) => (
                      <SelectItem key={system} value={system}>{system}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results column (always full width; filters do not consume grid columns on desktop) */}
          <div className="min-w-0">
          {shouldShowResults ? (
              <>
                <div className="max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {displayMaterials.map((material) => {
                    const isExpanded = expandedMaterials.has(material.material_id)
                    const youngModulusVrh = getYoungModulusVrh(material.elasticity)

                    return (
                      <div
                        key={material.material_id}
                        className="bg-gray-700 border-2 border-gray-600 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{material.formula_pretty}</h3>
                            <p className="text-sm text-gray-400">{material.material_id}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{material.chemsys}</p>
                          </div>
                          <div className="flex gap-1">
                            {material.elasticity?.fitting_method === "ml_predicted_proxy" && (
                              <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded">ML</span>
                            )}
                            {material.elasticity?.fitting_method === "ml_predicted" && (
                              <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded">ML</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          {/* Summary Scalars - Always visible */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Summary Scalars</h4>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Density:</span>
                              <span className="font-medium text-gray-200">{material.density.toFixed(3)} g/cm³</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Volume:</span>
                              <span className="font-medium text-gray-200">{material.volume.toFixed(2)} Ų</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sites:</span>
                              <span className="font-medium text-gray-200">{material.nsites}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Elements:</span>
                              <span className="font-medium text-gray-200">{material.elements.join(", ")}</span>
                            </div>
                          </div>

                          {isExpanded && (
                            <>
                              {/* Elastic Properties */}
                              <div className="border-t border-gray-600 pt-2 space-y-1">
                                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Elastic Properties</h4>
                                {material.elasticity?.bulk_modulus?.vrh != null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Bulk Modulus:</span>
                                    <span className="font-medium text-gray-200">{material.elasticity.bulk_modulus!.vrh.toFixed(2)} GPa</span>
                                  </div>
                                )}
                                {material.elasticity?.shear_modulus?.vrh != null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Shear Modulus:</span>
                                    <span className="font-medium text-gray-200">{material.elasticity.shear_modulus!.vrh.toFixed(2)} GPa</span>
                                  </div>
                                )}
                                {youngModulusVrh != null && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Young&apos;s Modulus:</span>
                                    <span className="font-medium text-gray-200">{youngModulusVrh.toFixed(2)} GPa</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Poisson&apos;s Ratio:</span>
                                  <span className="font-medium text-gray-200">{material.homogeneous_poisson.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Anisotropy:</span>
                                  <span className="font-medium text-gray-200">{material.universal_anisotropy.toFixed(4)}</span>
                                </div>
                              </div>

                              {/* Symmetry */}
                              <div className="border-t border-gray-600 pt-2 space-y-1">
                                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Symmetry</h4>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Crystal System:</span>
                                  <span className="font-medium text-gray-200">{material.symmetry.crystal_system}</span>
                                </div>
                                {material.symmetry.symbol && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Space Group:</span>
                                    <span className="font-medium text-gray-200">{material.symmetry.symbol} (#{material.symmetry.number})</span>
                                  </div>
                                )}
                                {material.symmetry.point_group && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Point Group:</span>
                                    <span className="font-medium text-gray-200">{material.symmetry.point_group}</span>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => toggleExpanded(material.material_id)}
                          className="mt-4 w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium py-2 border-t border-gray-600 transition-colors"
                        >
                          {isExpanded ? (
                            <><span>Show Less</span><ChevronUp className="h-4 w-4" /></>
                          ) : (
                            <><span>Show More Details</span><ChevronDown className="h-4 w-4" /></>
                          )}
                        </button>
                      </div>
                      )
                    })}
                  </div>
                </div>

                {!randomMaterial && filteredMaterials.length > 3 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => { if (showAll) setExpandedMaterials(new Set()); setShowAll(!showAll) }}
                      className="px-6 py-2 border border-gray-500 text-gray-300 hover:border-blue-500 hover:text-blue-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      {showAll ? 'Show Less' : `Show ${filteredMaterials.length - 3} more results`}
                    </button>
                  </div>
                )}

                {displayMaterials.length === 0 && (
                  <div className="text-center text-white py-12">
                    <p className="text-xl">No materials found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-white py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-xl mb-2">Ready to explore Aim materials?</p>
                <p className="text-gray-400">
                  Use the search bar, apply filters, or click &quot;Feeling Lucky?&quot; to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
