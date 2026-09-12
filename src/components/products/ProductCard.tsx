import type { Product } from "../../types/product";
import { Button } from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-amber-500/50 px-2.5 py-1 text-sm font-medium text-gray-700 backdrop-blur-md">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 mt-2">{product.brand}</p>
        <div className="flex mt-3 items-center justify-between">
          <span className="font-bold text-rose-600">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="text-sm text-amber-500">★ {product.rating}</span>
        </div>

        <div className="mt-4 pt-2">
          <Button className="w-full" disabled={!product.inStock} size="sm">
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
