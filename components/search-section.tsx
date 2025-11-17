"use client"

import { useState, useMemo } from "react"
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
  density: number
  band_gap: number
  formation_energy_per_atom: number
  energy_above_hull?: number
  is_stable: boolean
  symmetry: {
    crystal_system: string
    point_group?: string
  }
  volume: number
  nsites: number
  is_metal: boolean
  energy_per_atom?: number
  atomic_density?: number
  // Elastic properties
  bulk_modulus?: number
  shear_modulus?: number
  youngs_modulus?: number
  // Thermal properties
  thermal_conductivity_clarke?: number
  thermal_conductivity_cahill?: number
  debye_temperature?: number
  // Elasticity scalars
  universal_anisotropy?: number
}

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [densityRange, setDensityRange] = useState<[number, number]>([0, 20])
  const [bandGapRange, setBandGapRange] = useState<[number, number]>([0, 10])
  const [formationEnergyRange, setFormationEnergyRange] = useState<[number, number]>([-10, 0])
  const [volumeRange, setVolumeRange] = useState<[number, number]>([0, 500])
  const [bulkModulusRange, setBulkModulusRange] = useState<[number, number]>([0, 400])
  const [debyeTemperatureRange, setDebyeTemperatureRange] = useState<[number, number]>([0, 1000])
  const [crystalSystem, setCrystalSystem] = useState<string>("all")
  const [stableOnly, setStableOnly] = useState(false)
  const [metalOnly, setMetalOnly] = useState<string>("all")
  const [randomMaterial, setRandomMaterial] = useState<Material | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedMaterials, setExpandedMaterials] = useState<Set<string>>(new Set())

  const materials = materialsData as Material[]

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        searchQuery === "" ||
        material.material_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.formula_pretty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.elements.some((el) => el.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesDensity = material.density >= densityRange[0] && material.density <= densityRange[1]

      const matchesBandGap = material.band_gap >= bandGapRange[0] && material.band_gap <= bandGapRange[1]

      const matchesFormationEnergy = 
        material.formation_energy_per_atom >= formationEnergyRange[0] && 
        material.formation_energy_per_atom <= formationEnergyRange[1]

      const matchesVolume = material.volume >= volumeRange[0] && material.volume <= volumeRange[1]

      const matchesBulkModulus = 
        !material.bulk_modulus || 
        (material.bulk_modulus >= bulkModulusRange[0] && material.bulk_modulus <= bulkModulusRange[1])

      const matchesDebyeTemp = 
        !material.debye_temperature || 
        (material.debye_temperature >= debyeTemperatureRange[0] && material.debye_temperature <= debyeTemperatureRange[1])

      const matchesCrystalSystem = crystalSystem === "all" || material.symmetry.crystal_system === crystalSystem

      const matchesStability = !stableOnly || material.is_stable

      const matchesMetal = 
        metalOnly === "all" || 
        (metalOnly === "metal" && material.is_metal) || 
        (metalOnly === "non-metal" && !material.is_metal)

      return matchesSearch && matchesDensity && matchesBandGap && matchesFormationEnergy && 
             matchesVolume && matchesBulkModulus && matchesDebyeTemp && matchesCrystalSystem && 
             matchesStability && matchesMetal
    })
  }, [searchQuery, densityRange, bandGapRange, formationEnergyRange, volumeRange, 
      bulkModulusRange, debyeTemperatureRange, crystalSystem, stableOnly, metalOnly, materials])

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
    densityRange[0] !== 0 ||
    densityRange[1] !== 20 ||
    bandGapRange[0] !== 0 ||
    bandGapRange[1] !== 10 ||
    formationEnergyRange[0] !== -10 ||
    formationEnergyRange[1] !== 0 ||
    volumeRange[0] !== 0 ||
    volumeRange[1] !== 500 ||
    bulkModulusRange[0] !== 0 ||
    bulkModulusRange[1] !== 400 ||
    debyeTemperatureRange[0] !== 0 ||
    debyeTemperatureRange[1] !== 1000 ||
    crystalSystem !== "all" ||
    stableOnly ||
    metalOnly !== "all"

  const shouldShowResults = hasSearched || hasActiveFilters

  const displayMaterials = randomMaterial ? [randomMaterial] : filteredMaterials.slice(0, 12)

  return (
    <div className="w-full bg-gray-800 py-12 rounded-lg">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Search Materials Database</h2>

        <div className="bg-gray-700 rounded-lg border-2 border-gray-600 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by material ID, formula, or element..."
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

          {showFilters && (
            <div className="border-t-2 border-gray-600 pt-6 mt-6 space-y-6">
              {/* Summary Scalars Section */}
              <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Summary Scalars</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Density (g/cm³): {densityRange[0]} - {densityRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={20}
                      step={0.5}
                      value={densityRange}
                      onValueChange={(value) => {
                        setDensityRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Volume (Ų): {volumeRange[0]} - {volumeRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={volumeRange}
                      onValueChange={(value) => {
                        setVolumeRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Energy Properties Section */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Energy Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Band Gap (eV): {bandGapRange[0]} - {bandGapRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={10}
                      step={0.1}
                      value={bandGapRange}
                      onValueChange={(value) => {
                        setBandGapRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Formation Energy (eV/atom): {formationEnergyRange[0]} - {formationEnergyRange[1]}
                    </Label>
                    <Slider
                      min={-10}
                      max={0}
                      step={0.1}
                      value={formationEnergyRange}
                      onValueChange={(value) => {
                        setFormationEnergyRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Elastic Properties Section */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Elastic Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Bulk Modulus (GPa): {bulkModulusRange[0]} - {bulkModulusRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={400}
                      step={10}
                      value={bulkModulusRange}
                      onValueChange={(value) => {
                        setBulkModulusRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Thermal Properties Section */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Thermal Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">
                      Debye Temperature (K): {debyeTemperatureRange[0]} - {debyeTemperatureRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={1000}
                      step={50}
                      value={debyeTemperatureRange}
                      onValueChange={(value) => {
                        setDebyeTemperatureRange(value as [number, number])
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Material Classification Section */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">Material Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">Crystal System</Label>
                    <Select
                      value={crystalSystem}
                      onValueChange={(value) => {
                        setCrystalSystem(value)
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                    >
                      <SelectTrigger className="bg-gray-600 border-2 border-gray-500 text-white focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Systems</SelectItem>
                        {crystalSystems.map((system) => (
                          <SelectItem key={system} value={system}>
                            {system}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-200">Material Type</Label>
                    <Select
                      value={metalOnly}
                      onValueChange={(value) => {
                        setMetalOnly(value)
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                    >
                      <SelectTrigger className="bg-gray-600 border-2 border-gray-500 text-white focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="metal">Metals Only</SelectItem>
                        <SelectItem value="non-metal">Non-Metals Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stable"
                      checked={stableOnly}
                      onChange={(e) => {
                        setStableOnly(e.target.checked)
                        setRandomMaterial(null)
                        setHasSearched(true)
                      }}
                      className="h-4 w-4 border-2 border-gray-500"
                    />
                    <Label htmlFor="stable" className="text-sm font-medium cursor-pointer text-gray-200">
                      Stable materials only
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {shouldShowResults ? (
          <>
            <div className="text-white text-center mb-6">
              {randomMaterial ? (
                <p className="text-lg">
                  <span className="font-bold">Random Material Selected</span>
                </p>
              ) : (
                <p className="text-lg">
                  Found <span className="font-bold">{filteredMaterials.length}</span> materials
                  {filteredMaterials.length > 12 && " (showing first 12)"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMaterials.map((material) => {
                const isExpanded = expandedMaterials.has(material.material_id)
                
                return (
                  <div
                    key={material.material_id}
                    className="bg-gray-700 border-2 border-gray-600 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{material.formula_pretty}</h3>
                        <p className="text-sm text-gray-400">{material.material_id}</p>
                      </div>
                      <div className="flex gap-1">
                        {material.is_stable && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Stable</span>
                        )}
                        {material.is_metal && (
                          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Metal</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      {/* Summary Scalars Section - Always visible */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Summary Scalars</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Density:</span>
                          <span className="font-medium text-gray-200">{material.density.toFixed(2)} g/cm³</span>
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
                          {/* Energy Properties Section */}
                          <div className="border-t border-gray-600 pt-2 space-y-1">
                            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Energy Properties</h4>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Formation Energy:</span>
                              <span className="font-medium text-gray-200">
                                {material.formation_energy_per_atom.toFixed(3)} eV/atom
                              </span>
                            </div>
                            {material.energy_above_hull !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Energy Above Hull:</span>
                                <span className="font-medium text-gray-200">
                                  {material.energy_above_hull.toFixed(3)} eV/atom
                                </span>
                              </div>
                            )}
                            {material.energy_per_atom !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Energy Per Atom:</span>
                                <span className="font-medium text-gray-200">
                                  {material.energy_per_atom.toFixed(3)} eV/atom
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-400">Band Gap:</span>
                              <span className="font-medium text-gray-200">{material.band_gap.toFixed(2)} eV</span>
                            </div>
                          </div>

                          {/* Elastic Properties Section (if available) */}
                          {(material.bulk_modulus || material.shear_modulus || material.youngs_modulus) && (
                            <div className="border-t border-gray-600 pt-2 space-y-1">
                              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Elastic Properties</h4>
                              {material.bulk_modulus !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Bulk Modulus:</span>
                                  <span className="font-medium text-gray-200">{material.bulk_modulus.toFixed(1)} GPa</span>
                                </div>
                              )}
                              {material.shear_modulus !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Shear Modulus:</span>
                                  <span className="font-medium text-gray-200">{material.shear_modulus.toFixed(1)} GPa</span>
                                </div>
                              )}
                              {material.youngs_modulus !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Young's Modulus:</span>
                                  <span className="font-medium text-gray-200">{material.youngs_modulus.toFixed(1)} GPa</span>
                                </div>
                              )}
                              {material.universal_anisotropy !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Anisotropy:</span>
                                  <span className="font-medium text-gray-200">{material.universal_anisotropy.toFixed(3)}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Thermal Properties Section (if available) */}
                          {(material.thermal_conductivity_clarke || material.thermal_conductivity_cahill || material.debye_temperature) && (
                            <div className="border-t border-gray-600 pt-2 space-y-1">
                              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Thermal Properties</h4>
                              {material.thermal_conductivity_clarke !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Therm. Cond. (Clarke):</span>
                                  <span className="font-medium text-gray-200">{material.thermal_conductivity_clarke.toFixed(2)} W/mK</span>
                                </div>
                              )}
                              {material.thermal_conductivity_cahill !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Therm. Cond. (Cahill):</span>
                                  <span className="font-medium text-gray-200">{material.thermal_conductivity_cahill.toFixed(2)} W/mK</span>
                                </div>
                              )}
                              {material.debye_temperature !== undefined && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Debye Temp.:</span>
                                  <span className="font-medium text-gray-200">{material.debye_temperature.toFixed(1)} K</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Symmetry Section */}
                          <div className="border-t border-gray-600 pt-2 space-y-1">
                            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Symmetry</h4>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Crystal System:</span>
                              <span className="font-medium text-gray-200">{material.symmetry.crystal_system}</span>
                            </div>
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
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Show More Details</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

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
            <p className="text-xl mb-2">Ready to explore materials?</p>
            <p className="text-gray-400">
              Use the search bar, apply filters, or click "Feeling Lucky?" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
