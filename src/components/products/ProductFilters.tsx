interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectedCategory: (cat: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
}

export function ProductsFilter({
  categories,
  selectedCategory,
  onSelectedCategory,
  maxPrice,
  onPriceChange,
}: FilterProps) {
  return (
    <aside className="w-full md:w-64 bg-white p-5 rounded-2xl shadow-md border border-gray-100 space-y-6">
      <h3 className="font-bold text-gray-800 text-lg border-b pb-3">
        Filters 🛍️
      </h3>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <div className="space-y-2">
          {["All", ...categories].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-black"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => onSelectedCategory(cat)}
                className="accent-primary"
              />{" "}
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-semibold text-gray-700">Maximum price:</span>
          <span className="text-primary font-bold">
            {maxPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="2000"
          step="10"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </aside>
  );
}
