import { useState } from "react";
import { mockData } from "../data/products";
import { ProductsFilter } from "../components/products/ProductFilters";
import { ProductCard } from "../components/products/ProductCard";

export function ProductsPage() {
  const [selectedCategory, setSelectedCategpry] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(mockData.map((p) => p.category)));

  const filteredProducts = mockData.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || selectedCategory === p.category;
    const matchePrice = p.price <= maxPrice;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchePrice && matchesSearch;
  });

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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed">No products found with these specifications! 🧐</div>
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

// <div className="container mx-auto px-4 py-8">
//   <h1 className="text-2xl mb-6 font-bold">All Products</h1>
//   <p className="text-gray-600">
//     The full list and filters will be here soon! 😉
//   </p>
// </div>
