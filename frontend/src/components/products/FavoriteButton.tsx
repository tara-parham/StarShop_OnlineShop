import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import type { Product } from "../../types/product";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
}

export function FavoriteButton({ product, className = "" }: FavoriteButtonProps) {
  const { favorites, toggleFavorite, loading, isPending } = useFavorites();
  const saved = favorites.some((item) => item.id === product.id);

  return (
    <button
      type="button"
      aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} Favorites`}
      aria-pressed={saved}
      disabled={loading || isPending(product.id)}
      onClick={() => void toggleFavorite(product)}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer ${saved ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-200"} ${className}`}
    >
      <Heart size={22} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
