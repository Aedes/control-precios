import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import React from "react"
import ProductRow from "./ProductRow"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  currentPrice: number
  characteristics?: string[]
}

interface ProductTableProps {
  products: Product[]
  editingPrice: string | null
  tempPrice: string
  handleEditPrice: (productId: string, currentPrice: number) => void
  handleSavePrice: (productId: string) => void
  handleCancelEdit: () => void
  setTempPrice: (value: string) => void
  formatPrice: (price: number) => string
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  editingPrice,
  tempPrice,
  handleEditPrice,
  handleSavePrice,
  handleCancelEdit,
  setTempPrice,
  formatPrice,
}) => {
  return (
    <div>
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
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              editingPrice={editingPrice}
              tempPrice={tempPrice}
              handleEditPrice={handleEditPrice}
              handleSavePrice={handleSavePrice}
              handleCancelEdit={handleCancelEdit}
              setTempPrice={setTempPrice}
              formatPrice={formatPrice}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable; 