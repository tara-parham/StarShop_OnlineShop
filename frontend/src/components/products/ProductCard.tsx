import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { Button } from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-slate-800">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <FavoriteButton product={product} className="absolute left-3 top-3" />
        <span className="absolute right-3 bottom-3 rounded-full bg-amber-100 dark:bg-amber-950/90 px-2.5 py-1 text-sm font-medium text-amber-900 dark:text-amber-200 backdrop-blur-md">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100">
          {product.name}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          {product.brand}
        </p>
        <div className="flex mt-3 items-center justify-between">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-amber-500">
            {product.rating > 0 ? `★ ${product.rating}` : "New"}
          </span>
        </div>

        <div className="mt-4 pt-2">
          <Button
            onClick={() => addToCart(product)}
            className="w-full"
            disabled={!product.inStock}
            size="sm"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
