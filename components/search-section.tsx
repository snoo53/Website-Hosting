"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, Sparkles } from "lucide-react"
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
  is_stable: boolean
  symmetry: {
    crystal_system: string
  }
  volume: number
  nsites: number
  is_metal: boolean
}

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [densityRange, setDensityRange] = useState<[number, number]>([0, 20])
  const [bandGapRange, setBandGapRange] = useState<[number, number]>([0, 10])
  const [crystalSystem, setCrystalSystem] = useState<string>("all")
  const [stableOnly, setStableOnly] = useState(false)
  const [randomMaterial, setRandomMaterial] = useState<Material | null>(null)

  const materials = materialsData as Material[]

  // Filter materials based on search and filters
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        material.material_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.formula_pretty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.elements.some((el) => el.toLowerCase().includes(searchQuery.toLowerCase()))

      // Density filter
      const matchesDensity = material.density >= densityRange[0] && material.density <= densityRange[1]

      // Band gap filter
      const matchesBandGap = material.band_gap >= bandGapRange[0] && material.band_gap <= bandGapRange[1]

      // Crystal system filter
      const matchesCrystalSystem = crystalSystem === "all" || material.symmetry.crystal_system === crystalSystem

      // Stability filter
      const matchesStability = !stableOnly || material.is_stable

      return matchesSearch && matchesDensity && matchesBandGap && matchesCrystalSystem && matchesStability
    })
  }, [searchQuery, densityRange, bandGapRange, crystalSystem, stableOnly, materials])

  // Get unique crystal systems
  const crystalSystems = useMemo(() => {
    const systems = new Set(materials.map((m) => m.symmetry.crystal_system))
    return Array.from(systems).sort()
  }, [materials])

  // Feeling Lucky - Random material
  const handleFeelingLucky = () => {
    const randomIndex = Math.floor(Math.random() * materials.length)
    setRandomMaterial(materials[randomIndex])
  }

  const displayMaterials = randomMaterial ? [randomMaterial] : filteredMaterials.slice(0, 12)

  return (
    <div className="w-full bg-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Search Materials Database</h2>

        {/* Search Bar */}
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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t-2 border-gray-600 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  }}
                  className="mt-2"
                />
              </div>

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
                  }}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-200">Crystal System</Label>
                <Select
                  value={crystalSystem}
                  onValueChange={(value) => {
                    setCrystalSystem(value)
                    setRandomMaterial(null)
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stable"
                  checked={stableOnly}
                  onChange={(e) => {
                    setStableOnly(e.target.checked)
                    setRandomMaterial(null)
                  }}
                  className="h-4 w-4 border-2 border-gray-500"
                />
                <Label htmlFor="stable" className="text-sm font-medium cursor-pointer text-gray-200">
                  Show stable materials only
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMaterials.map((material) => (
            <div
              key={material.material_id}
              className="bg-gray-700 border-2 border-gray-600 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{material.formula_pretty}</h3>
                  <p className="text-sm text-gray-400">{material.material_id}</p>
                </div>
                {material.is_stable && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Stable</span>}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Density:</span>
                  <span className="font-medium text-gray-200">{material.density.toFixed(2)} g/cm³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Band Gap:</span>
                  <span className="font-medium text-gray-200">
                    {material.band_gap.toFixed(2)} eV
                    {material.is_metal && " (Metal)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Formation Energy:</span>
                  <span className="font-medium text-gray-200">
                    {material.formation_energy_per_atom.toFixed(3)} eV/atom
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crystal System:</span>
                  <span className="font-medium text-gray-200">{material.symmetry.crystal_system}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <span className="text-gray-400">Elements:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {material.elements.map((element) => (
                      <span
                        key={element}
                        className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded border border-gray-500"
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayMaterials.length === 0 && (
          <div className="text-center text-white py-12">
            <p className="text-xl">No materials found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}
