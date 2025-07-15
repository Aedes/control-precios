import { Table, TableBody,  TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
      <Table className="border-l border-r border-gray-200">
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
          {products.map((product, idx) => (
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
              isLast={idx === products.length - 1}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable; 