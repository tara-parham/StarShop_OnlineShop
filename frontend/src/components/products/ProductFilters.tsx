import { formatPrice } from "../../utils/formatPrice";

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectedCategory: (cat: string) => void;
  maxPrice: number;
  priceLimit: number;
  onPriceChange: (price: number) => void;
}

export function ProductsFilter({
  categories,
  selectedCategory,
  onSelectedCategory,
  maxPrice,
  priceLimit,
  onPriceChange,
}: FilterProps) {
  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 space-y-6">
      <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg border-b pb-3">
        Filters 🛍️
      </h3>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
          Category
        </label>
        <div className="space-y-2">
          {["All", ...categories].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
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
          <span className="font-semibold text-gray-700 dark:text-slate-200">
            Maximum price:
          </span>
          <span className="text-primary font-bold">
            {formatPrice(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          aria-label="Maximum product price"
          min="0"
          max={priceLimit}
          step="1"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </aside>
  );
}
