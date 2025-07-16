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
  formatPrice: (price: number) => string
  onEditProduct: (product: Product) => void
  onDeleteProduct: (product: Product) => void
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  formatPrice,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div>
      <Table className="border-l border-r border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
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
              formatPrice={formatPrice}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
              isLast={idx === products.length - 1}
              isFirst={idx === 0}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable; 