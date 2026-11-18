import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShop, CatalogStatus } from "../context/ShopContext";
import { ProductsFilter } from "../components/products/ProductFilters";
import { ProductCard } from "../components/products/ProductCard";

export function ProductsPage() {
  const { products, loading, error } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("Category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const [priceFilter, setMaxPrice] = useState<number | null>(null);
  const priceLimit = Math.max(100, ...products.map((p) => Math.ceil(p.price)));
  const maxPrice = Math.min(priceFilter ?? priceLimit, priceLimit);
  type Sort = "default" | "price-asc" | "price-desc";
  const rawSort = searchParams.get("sort");
  const sortBy: Sort =
    rawSort === "price-asc" || rawSort === "price-desc" ? rawSort : "default";
  function setFilter(key: string, value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || selectedCategory === product.category;
        const matchesPrice = product.price <= maxPrice;
        const matchesSearch = (product.name + " " + product.brand)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((firstProduct, secondProduct) => {
        if (sortBy === "price-asc")
          return firstProduct.price - secondProduct.price;
        if (sortBy === "price-desc")
          return secondProduct.price - firstProduct.price;
        return 0;
      });
  }, [products, selectedCategory, maxPrice, searchQuery, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mb-8 mx-auto">
        <input
          type="text"
          placeholder="Product Search..."
          value={searchQuery}
          onChange={(e) => setFilter("search", e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProductsFilter
          categories={categories}
          maxPrice={maxPrice}
          priceLimit={priceLimit}
          onPriceChange={setMaxPrice}
          onSelectedCategory={(value) => setFilter("Category", value)}
          selectedCategory={selectedCategory}
        />
        <div className="w-full flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              Showing {filteredProducts.length} products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setFilter("sort", e.target.value)}
              className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-rose-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
          {loading || error ? (
            <CatalogStatus />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed">
              No products found with these specifications! 🧐
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
