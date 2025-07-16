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

// Función para normalizar strings (quita tildes y espacios, y pasa a minúsculas)
function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

// Función para capitalizar la primer letra de un string
function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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

  // Estado para modal de nuevo producto
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    characteristics: [] as { name: string; options: string[]; selected: string[] }[],
  })
  const [newCharacteristic, setNewCharacteristic] = useState("")
  const [characteristicOptions, setCharacteristicOptions] = useState<{ [key: string]: string[] }>({})
  const [optionInputs, setOptionInputs] = useState<{ [key: string]: string }>({})

  // Estado para biblioteca de características generales y sus opciones
  const [characteristicsLibrary, setCharacteristicsLibrary] = useState<{ name: string; options: string[] }[]>([])

  // Estado para categorías generales de características
  const [generalCharacteristics, setGeneralCharacteristics] = useState<string[]>([])

  // Estado para edición de producto
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  // Obtener marcas y categorías únicas
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products])
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])

  // Filtrar productos para búsqueda
  const filteredProducts = useMemo(
    () => {
      const normalizedSearch = normalizeString(searchTerm)
      return products.filter((product) =>
        normalizeString(product.name).includes(normalizedSearch) ||
        normalizeString(product.category).includes(normalizedSearch) ||
        normalizeString(product.brand).includes(normalizedSearch) ||
        (product.characteristics && product.characteristics.some(char => normalizeString(char).includes(normalizedSearch)))
      )
    },
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

  // Función para agregar característica general
  const handleAddCharacteristic = () => {
    const trimmed = newCharacteristic.trim()
    if (!trimmed || newProduct.characteristics.some(c => c.name === trimmed)) return
    setNewProduct(prev => ({
      ...prev,
      characteristics: [
        ...prev.characteristics,
        { name: trimmed, options: [], selected: [] },
      ],
    }))
    if (!characteristicsLibrary.some(c => c.name === trimmed)) {
      setCharacteristicsLibrary(prev => [...prev, { name: trimmed, options: [] }])
    }
    setNewCharacteristic("")
  }

  // Función para agregar opción a una característica
  const handleAddOption = (charName: string) => {
    const option = optionInputs[charName]?.trim()
    if (!option) return
    setNewProduct(prev => ({
      ...prev,
      characteristics: prev.characteristics.map(c =>
        c.name === charName && !c.options.includes(option)
          ? { ...c, options: [...c.options, option] }
          : c
      ),
    }))
    setOptionInputs(prev => ({ ...prev, [charName]: "" }))
    // Actualiza la biblioteca global
    setCharacteristicsLibrary(prev =>
      prev.map(c =>
        c.name === charName && !c.options.includes(option)
          ? { ...c, options: [...c.options, option] }
          : c
      )
    )
  }

  // Función para seleccionar/deseleccionar opciones
  const handleToggleOption = (charName: string, option: string) => {
    const key = `${charName}:${option}`
    setNewProduct(prev => ({
      ...prev,
      characteristics: prev.characteristics.map(c =>
        c.name === charName
          ? {
              ...c,
              selected: c.selected.includes(key)
                ? c.selected.filter(o => o !== key)
                : [...c.selected, key],
            }
          : c
      ),
    }))
  }

  // Al abrir el modal de nuevo producto, inicializa las características y opciones existentes
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
    setEditingProductId(null)
    setNewProduct({
      name: "",
      price: "",
      category: "",
      characteristics: characteristicsLibrary.map(c => ({ name: c.name, options: c.options, selected: [] })),
    })
    setCharacteristicOptions({})
    setOptionInputs({})
  }

  // Al hacer clic en editar producto
  const handleEditProduct = (product: Product) => {
    setIsAddModalOpen(true)
    setEditingProductId(product.id)
    setNewProduct({
      name: product.name,
      price: product.currentPrice.toString(),
      category: product.category,
      characteristics: characteristicsLibrary.map(c => ({
        name: c.name,
        options: c.options,
        selected: product.characteristics?.filter(char => char.startsWith(`${c.name}:`)) || [],
      })),
    })
    setCharacteristicOptions({})
    setOptionInputs({})
  }

  // Guardar producto (crear o editar)
  const handleSaveProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price.trim() || !newProduct.category.trim()) return
    if (editingProductId) {
      setProducts(prev => prev.map(p =>
        p.id === editingProductId
          ? {
              ...p,
              name: newProduct.name,
              brand: "",
              category: newProduct.category,
              currentPrice: Number(newProduct.price),
              characteristics: newProduct.characteristics.flatMap(c => c.selected),
            }
          : p
      ))
    } else {
      setProducts(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          name: newProduct.name,
          brand: "",
          category: newProduct.category,
          currentPrice: Number(newProduct.price),
          characteristics: newProduct.characteristics.flatMap(c => c.selected),
        },
      ])
    }
    setIsAddModalOpen(false)
    setEditingProductId(null)
    setNewProduct({ name: "", price: "", category: "", characteristics: [] })
    setCharacteristicOptions({})
    setOptionInputs({})
  }

  // Eliminar producto
  const handleDeleteProduct = (product: Product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id))
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
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleOpenAddModal}
      >
        Agregar producto
      </button>
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4 relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setIsAddModalOpen(false)}>
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Nuevo producto</h2>
            <div className="space-y-2">
              <input
                className="border px-2 py-1 rounded w-full"
                placeholder="Nombre"
                value={newProduct.name}
                onChange={e => setNewProduct(p => ({ ...p, name: capitalizeFirst(e.target.value) }))}
              />
              <input
                className="border px-2 py-1 rounded w-full"
                placeholder="Precio"
                type="number"
                value={newProduct.price}
                onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
              />
              <input
                className="border px-2 py-1 rounded w-full"
                placeholder="Categoría"
                value={newProduct.category}
                onChange={e => setNewProduct(p => ({ ...p, category: capitalizeFirst(e.target.value) }))}
              />
            </div>
            <div className="mt-4">
              <div className="flex gap-2 mb-2">
                <input
                  className="border px-2 py-1 rounded flex-1"
                  placeholder="Nueva característica general (ej: Marcas)"
                  value={newCharacteristic}
                  onChange={e => setNewCharacteristic(capitalizeFirst(e.target.value))}
                />
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={handleAddCharacteristic}
                  type="button"
                >
                  Agregar característica
                </button>
              </div>
              {newProduct.characteristics.map((char) => (
                <div key={char.name} className="mb-2 border rounded p-2">
                  <div className="font-semibold mb-1">{char.name}</div>
                  <div className="flex gap-2 mb-1">
                    <input
                      className="border px-2 py-1 rounded flex-1"
                      placeholder={`Nueva opción para ${char.name}`}
                      value={optionInputs[char.name] || ""}
                      onChange={e => setOptionInputs(prev => ({ ...prev, [char.name]: capitalizeFirst(e.target.value) }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption(char.name);
                        }
                      }}
                    />
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleAddOption(char.name)}
                      type="button"
                    >
                      Agregar opción
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {characteristicsLibrary.find(c => c.name === char.name)?.options.concat(char.options.filter(o => !characteristicsLibrary.find(c => c.name === char.name)?.options.includes(o)))
                      .map(option => {
                        const key = `${char.name}:${option}`
                        return (
                          <label key={key} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={char.selected.includes(key)}
                              onChange={() => handleToggleOption(char.name, option)}
                            />
                            <span>{option}</span>
                          </label>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
              onClick={handleSaveProduct}
              type="button"
            >
              Guardar producto
            </button>
          </div>
        </div>
      )}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductTable
        products={filteredProducts}
        formatPrice={formatPrice}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  )
}
