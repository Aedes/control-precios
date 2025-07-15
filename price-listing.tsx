"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings2, Search, DollarSign, TrendingUp, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

  // Estados para ajuste masivo
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [adjustmentType, setAdjustmentType] = useState<"percentage" | "fixed">("percentage")
  const [adjustmentValue, setAdjustmentValue] = useState<string>("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Obtener marcas y categorías únicas
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort()
  }, [products])

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort()
  }, [products])

  // Filtrar productos para búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [products, searchTerm])

  // Productos que serán afectados por el ajuste masivo
  const affectedProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = selectedBrand === "all" || product.brand === selectedBrand
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
      return brandMatch && categoryMatch
    })
  }, [products, selectedBrand, selectedCategory])

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

    // Resetear formulario
    setSelectedBrand("all")
    setSelectedCategory("all")
    setAdjustmentValue("")
    setShowConfirmation(false)
    setIsModalOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listado de Precios</h1>
          <p className="text-muted-foreground">Gestión de precios de productos</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Settings2 className="h-4 w-4" />
              Ajuste Masivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajuste Masivo de Precios</DialogTitle>
              <DialogDescription>Selecciona los filtros y el tipo de ajuste a aplicar</DialogDescription>
            </DialogHeader>

            {!showConfirmation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Ajuste</Label>
                  <Select
                    value={adjustmentType}
                    onValueChange={(value: "percentage" | "fixed") => setAdjustmentType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                      <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjustment">
                    {adjustmentType === "percentage" ? "Porcentaje de ajuste" : "Monto de ajuste"}
                  </Label>
                  <Input
                    id="adjustment"
                    type="number"
                    placeholder={adjustmentType === "percentage" ? "ej: 5 o -10" : "ej: 1000 o -500"}
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                  />
                </div>

                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    Se aplicará a <strong>{affectedProducts.length}</strong> productos
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Confirmación de cambios:</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {affectedProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{product.name}</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{formatPrice(product.currentPrice)}</span>
                        <span>→</span>
                        <span className="font-semibold">{formatPrice(calculateNewPrice(product.currentPrice))}</span>
                      </div>
                    </div>
                  ))}
                  {affectedProducts.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ... y {affectedProducts.length - 5} productos más
                    </p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              {!showConfirmation ? (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(true)}
                    disabled={!adjustmentValue || affectedProducts.length === 0}
                    className="flex-1"
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                  <Button onClick={handleMassiveAdjustment} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, marca o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredProducts.length})</CardTitle>
          <CardDescription>Lista de productos con precios editables</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Características</TableHead>
                <TableHead className="text-right">Precio Actual</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.brand}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.characteristics?.slice(0, 2).map((char, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                      {product.characteristics && product.characteristics.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.characteristics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingPrice === product.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="w-24 text-right"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleSavePrice(product.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="font-semibold">{formatPrice(product.currentPrice)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPrice !== product.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditPrice(product.id, product.currentPrice)}
                      >
                        Editar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
