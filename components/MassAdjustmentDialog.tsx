import React from "react"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, TrendingUp, Check, X, Settings2 } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  currentPrice: number
  characteristics?: string[]
}

interface MassAdjustmentDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  brands: string[]
  categories: string[]
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  adjustmentType: "percentage" | "fixed"
  setAdjustmentType: (type: "percentage" | "fixed") => void
  adjustmentValue: string
  setAdjustmentValue: (value: string) => void
  showConfirmation: boolean
  setShowConfirmation: (show: boolean) => void
  affectedProducts: Product[]
  calculateNewPrice: (currentPrice: number) => number
  handleMassiveAdjustment: () => void
  formatPrice: (price: number) => string
}

const MassAdjustmentDialog: React.FC<MassAdjustmentDialogProps> = ({
  isOpen,
  setIsOpen,
  brands,
  categories,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  adjustmentType,
  setAdjustmentType,
  adjustmentValue,
  setAdjustmentValue,
  showConfirmation,
  setShowConfirmation,
  affectedProducts,
  calculateNewPrice,
  handleMassiveAdjustment,
  formatPrice,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
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
  )
}

export default MassAdjustmentDialog; 