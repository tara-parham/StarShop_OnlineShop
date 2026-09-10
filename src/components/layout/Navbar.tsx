import { useState } from "react";
import type { Category } from "../../types/product";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import logoImg from "../../assets/images/logo.png"

const catogories: Category[] = [
  "Cosmetics",
  "Skin Care",
  "Hair Care",
  "Self Care",
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
            <img src={logoImg} alt="" className="h-19 w-auto object-contain p-1 transition-transform duration-300 hover:scale-110" />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {catogories.map((cat) => (
              <a
                key={cat}
                className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors"
                href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors cursor-pointer">
              <Search size={20} />
            </button>

            <button className="relative p-2 text-gray-600 hover:text-rose-500 transition-colors cursor-pointer">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
            </button>

            <Button size="sm" className="cursor-pointer hidden sm:inline-flex">Sign in / Login</Button>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 cursor-pointer">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-2 pb-4 space-y-2">
          {catogories.map((cat) => (
            <a onClick={() => setIsOpen(!isOpen)} href={`#${cat}`} key={cat} className="block py-2 text-sm font-medium text-gray-700 hover:text-rose-500">
              {cat}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
