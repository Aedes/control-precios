"use client"

import { useState, useMemo } from "react"
import ProductTable from "./components/ProductTable"
import MassAdjustmentDialog from "./components/MassAdjustmentDialog"
import SearchBar from "./components/SearchBar"
import { formatPrice } from "./lib/priceUtils"

// Tipos de datos
interface Product {
  id: string
  name: string
  brand: string
  category: string
  currentPrice: number
  characteristics?: string[]
}

// Datos de ejemplo
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Puerta Principal Modelo A",
    brand: "Aluar",
    category: "Puertas",
    currentPrice: 85000,
    characteristics: ["Aluminio", "Doble vidrio", "120x210cm"],
  },
  {
    id: "2",
    name: "Ventana Corrediza Standard",
    brand: "Modena",
    category: "Ventanas",
    currentPrice: 45000,
    characteristics: ["Aluminio", "Vidrio simple", "100x120cm"],
  },
  {
    id: "3",
    name: "Membrana Asfáltica Premium",
    brand: "Sika",
    category: "Membranas",
    currentPrice: 12500,
    characteristics: ["4mm", "Poliéster", "10m²"],
  },
  {
    id: "4",
    name: "Puerta Balcón Doble Hoja",
    brand: "Aluar",
    category: "Puertas",
    currentPrice: 125000,
    characteristics: ["Aluminio", "DVH", "160x210cm"],
  },
  {
    id: "5",
    name: "Ventana Banderola",
    brand: "Modena",
    category: "Ventanas",
    currentPrice: 32000,
    characteristics: ["Aluminio", "Vidrio simple", "80x40cm"],
  },
  {
    id: "6",
    name: "Membrana Líquida Elastomérica",
    brand: "Weber",
    category: "Membranas",
    currentPrice: 8900,
    characteristics: ["Líquida", "20kg", "Blanca"],
  },
]

export default function PriceListingSystem() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [adjustmentType, setAdjustmentType] = useState<"percentage" | "fixed">("percentage")
  const [adjustmentValue, setAdjustmentValue] = useState<string>("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Obtener marcas y categorías únicas
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products])
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])

  // Filtrar productos para búsqueda
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [products, searchTerm],
  )

  // Productos que serán afectados por el ajuste masivo
  const affectedProducts = useMemo(
    () =>
      products.filter((product) => {
        const brandMatch = selectedBrand === "all" || product.brand === selectedBrand
        const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
        return brandMatch && categoryMatch
      }),
    [products, selectedBrand, selectedCategory],
  )

  // Calcular nuevo precio
  const calculateNewPrice = (currentPrice: number): number => {
    const value = Number.parseFloat(adjustmentValue)
    if (isNaN(value)) return currentPrice
    if (adjustmentType === "percentage") {
      return Math.round(currentPrice * (1 + value / 100))
    } else {
      return Math.round(currentPrice + value)
    }
  }

  // Manejar edición individual
  const handleEditPrice = (productId: string, currentPrice: number) => {
    setEditingPrice(productId)
    setTempPrice(currentPrice.toString())
  }
  const handleSavePrice = (productId: string) => {
    const newPrice = Number.parseFloat(tempPrice)
    if (!isNaN(newPrice) && newPrice > 0) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, currentPrice: newPrice } : p)))
    }
    setEditingPrice(null)
    setTempPrice("")
  }
  const handleCancelEdit = () => {
    setEditingPrice(null)
    setTempPrice("")
  }

  // Manejar ajuste masivo
  const handleMassiveAdjustment = () => {
    const value = Number.parseFloat(adjustmentValue)
    if (isNaN(value)) return
    setProducts((prev) =>
      prev.map((product) => {
        const shouldAdjust =
          (selectedBrand === "all" || product.brand === selectedBrand) &&
          (selectedCategory === "all" || product.category === selectedCategory)
        if (shouldAdjust) {
          return { ...product, currentPrice: calculateNewPrice(product.currentPrice) }
        }
        return product
      }),
    )
    setSelectedBrand("all")
    setSelectedCategory("all")
    setAdjustmentValue("")
    setShowConfirmation(false)
    setIsModalOpen(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listado de Precios</h1>
          <p className="text-muted-foreground">Gestión de precios de productos</p>
        </div>
        <MassAdjustmentDialog
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          brands={brands}
          categories={categories}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          adjustmentType={adjustmentType}
          setAdjustmentType={setAdjustmentType}
          adjustmentValue={adjustmentValue}
          setAdjustmentValue={setAdjustmentValue}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          affectedProducts={affectedProducts}
          calculateNewPrice={calculateNewPrice}
          handleMassiveAdjustment={handleMassiveAdjustment}
          formatPrice={formatPrice}
        />
      </div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductTable
        products={filteredProducts}
        editingPrice={editingPrice}
        tempPrice={tempPrice}
        handleEditPrice={handleEditPrice}
        handleSavePrice={handleSavePrice}
        handleCancelEdit={handleCancelEdit}
        setTempPrice={setTempPrice}
        formatPrice={formatPrice}
      />
    </div>
  )
}
