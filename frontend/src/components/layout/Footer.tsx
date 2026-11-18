import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
export function Footer() {
  const { settings } = useShop();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white tracking-wider">
              {settings?.storeName || "StarShop"} ✨
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curating the finest beauty and skincare products for your
              everlasting glow.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Quick Access</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Our Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/products?Category=Skin Care"
                  className="hover:text-primary transition"
                >
                  Skin Care
                </Link>
              </li>
              <li>
                <Link
                  to="/products?Category=Cosmetics"
                  className="hover:text-primary transition"
                >
                  Makeup / Cosmetics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?Category=Hair Care"
                  className="hover:text-pink-400 transition"
                >
                  Hair Care
                </Link>
              </li>
              <li>
                <Link
                  to="/products?Category=Self Care"
                  className="hover:text-primary transition"
                >
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <p className="text-sm text-gray-400">
              We’re here to help with your beauty routine.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          © {new Date().getFullYear()} {settings?.storeName || "StarShop"}. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
