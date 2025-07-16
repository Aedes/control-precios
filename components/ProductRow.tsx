import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import React, { useState } from "react"
import { MoreVertical } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  currentPrice: number
  characteristics?: string[]
}

interface ProductRowProps {
  product: Product
  formatPrice: (price: number) => string
  onEditProduct: (product: Product) => void
  onDeleteProduct: (product: Product) => void
  isLast?: boolean
  isFirst?: boolean
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  formatPrice,
  isLast = false,
  isFirst = false,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <TableRow className={
      `${isLast ? "border-b border-gray-300" : ""} ${!isFirst ? "border-l border-r border-gray-200" : ""}`.trim()
    }>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{product.category}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {product.characteristics?.slice(0, 2).map((char, index) => {
            const value = char.includes(":") ? char.split(":").slice(1).join(":") : char
            return (
              <Badge key={index} variant="secondary" className="text-xs">
                {value}
              </Badge>
            )
          })}
          {product.characteristics && product.characteristics.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{product.characteristics.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-semibold">{formatPrice(product.currentPrice)}</span>
      </TableCell>
      <TableCell className="relative">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Más opciones"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 bottom-12 w-32 bg-white border rounded shadow z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false)
                onEditProduct(product)
              }}
            >
              Editar
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              onClick={() => {
                setMenuOpen(false)
                onDeleteProduct(product)
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

export default ProductRow; 