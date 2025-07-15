import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import React from "react"

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
  editingPrice: string | null
  tempPrice: string
  handleEditPrice: (productId: string, currentPrice: number) => void
  handleSavePrice: (productId: string) => void
  handleCancelEdit: () => void
  setTempPrice: (value: string) => void
  formatPrice: (price: number) => string
  isLast?: boolean
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  editingPrice,
  tempPrice,
  handleEditPrice,
  handleSavePrice,
  handleCancelEdit,
  setTempPrice,
  formatPrice,
  isLast = false,
}) => {
  return (
    <TableRow className={isLast ? "border-b border-gray-300" : ""}>
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
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              <X className="h-4 w-4 text-red-600" />
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
  )
}

export default ProductRow; 