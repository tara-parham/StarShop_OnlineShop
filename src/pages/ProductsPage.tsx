import { useMemo, useState } from "react";
import { mockData } from "../data/products";
import { ProductsFilter } from "../components/products/ProductFilters";
import { ProductCard } from "../components/products/ProductCard";

export function ProductsPage() {
  const [selectedCategory, setSelectedCategpry] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"defalut" | "price-asc" | "price-desc">(
    "defalut",
  );

  const categories = Array.from(new Set(mockData.map((p) => p.category)));

  const filteredProducts = useMemo(() => {
    return mockData
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || selectedCategory === product.category;
        const matchesPrice = product.price <= maxPrice;
        const matchesSerch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSerch;
      })
      .sort((firstProduct, secondProduct) => {
        if (sortBy === "price-asc")
          return firstProduct.price - secondProduct.price;
        if (sortBy === "price-desc")
          return secondProduct.price - firstProduct.price;
        return 0;
      });
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mb-8 mx-auto">
        <input
          type="text"
          placeholder="Product Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProductsFilter
          categories={categories}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          onSelectedCategory={setSelectedCategpry}
          selectedCategory={selectedCategory}
        />
        <div className="w-full flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-gray-600">
              Showing {filteredProducts.length} products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-rose-50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">
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
