import { Link, useNavigate, useParams } from "react-router-dom";
import { useShop, CatalogStatus } from "../context/ShopContext";
import { Button } from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { FavoriteButton } from "../components/products/FavoriteButton";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useShop();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  if (loading || error) return <CatalogStatus />;

  if (!product) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">
          The requested product was not found! 🧐
        </h2>
        <Button onClick={() => navigate("/products")}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 dark:text-slate-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-slate-100 font-medium">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-950 overflow-hidden rounded-xl p-6">
          <img
            className="w-full max-h-96 object-contain hover:scale-105 transition-transform duration-300"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-block text-primary bg-primary/10 text-sm font-semibold px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-slate-100 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                {product.rating > 0 ? product.rating : "New product"}
              </span>
              {product.rating > 0 && (
                <span className="text-xs text-gray-400">(out of 5)</span>
              )}
            </div>

            <p className="leading-relaxed mb-6 text-gray-600 dark:text-slate-300">
              {product.description ||
                "Additional details for this product will be added soon."}
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500 dark:text-slate-400">
                Final Price:
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => addToCart(product)}
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
              >
                Add to Cart 🛒
              </Button>
              <FavoriteButton
                product={product}
                className="shrink-0 self-center border border-gray-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
