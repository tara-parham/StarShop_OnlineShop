export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white tracking-wider">
              StarShop ✨
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Curating the finest beauty and skincare products for your
              everlasting glow.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Quick Access</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Skin Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Makeup / Cosmetics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Hair Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition">
                  Personal Care
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <p className="text-sm text-gray-400">Support: support@starshop.com</p>
            <p className="text-sm text-gray-400 mt-1">Fast Nationwide Delivery 🚀</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} StarShop. All rights reserved.</div>
      </div>
    </footer>
  );
}
