import { useTheme } from "../../context/ThemeContext";
import { useShop } from "../../context/ShopContext";
import { useState } from "react";
import type { Category } from "../../types/product";
import { ShoppingBag, Search, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "../ui/Button";
import logoImg from "../../assets/images/logo.png";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const catogories: Category[] = [
  "Cosmetics",
  "Skin Care",
  "Hair Care",
  "Self Care",
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useShop();

  function handleSearchSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  }
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              aria-label={settings?.storeName || "StarShop"}
              className="flex items-center gap-2"
            >
              <img
                src={logoImg}
                alt=""
                className="h-19 w-auto object-contain p-1 transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {catogories.map((cat) => (
              <Link
                to={`/products?Category=${cat}`}
                key={cat}
                className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Button
              variant="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCount}
              </span>
            </Link>
            <div className="relative">
              <Button
                variant="icon"
                size="lg"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
              >
                <Search size={20} />
              </Button>

              {showSearch && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-12 z-50 bg-white dark:bg-slate-900 shadow-xl rounded-xl p-2 border border-rose-100 dark:border-slate-800 flex items-center gap-2 w-72"
                >
                  <input
                    type="text"
                    placeholder="Search Products"
                    value={searchQuery}
                    autoFocus
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-rose-50/80 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button>Go</Button>
                </form>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  className="text-xs text-primary font-medium"
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                >
                  {user.role === "admin" ? "Admin" : "Account"}
                </Link>
                <Link
                  to="/"
                  onClick={() => void logout()}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-slate-900 hover:bg-rose-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-rose-600 hover:bg-primaryHover transition-colors rounded-xl shadow-sm cursor-pointer"
              >
                Sign in
              </Link>
            )}

            <Button
              variant="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-rose-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {catogories.map((cat) => (
            <Link
              to={`/products?Category=${encodeURIComponent(cat)}`}
              onClick={() => setIsOpen(!isOpen)}
              key={cat}
              className="block py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:text-primary"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
