import { useShop, CatalogStatus } from "../../context/ShopContext";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const { products } = useShop();
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Featured Products
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Most Popular Beauty & Care Products
          </p>
        </div>

        <CatalogStatus />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
