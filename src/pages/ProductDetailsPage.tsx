import { Link, useNavigate, useParams } from "react-router-dom";
import { mockData } from "../data/products";
import { Button } from "../components/ui/Button";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockData.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          The requested product was not found! 🧐
        </h2>
        <Button onClick={() => navigate("/products")}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center bg-gray-50 overflow-hidden rounded-xl p-6">
          <img className="w-full max-h-96 object-contain hover:scale-105 transition-transform duration-300" src={product.image} alt={product.name} />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-block text-primary bg-primary/10 text-sm font-semibold px-3 py-1 rounded-full mb-3">{product.category}</span>
            <h1 className="font-bold text-2xl md:text-3xl text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              <span className="text-xs text-gray-400">(out of 5)</span>
            </div>

            <p className="leading-relaxed mb-6 text-gray-600">
              {product.description ||
                "Additional details for this product will be added soon."}
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500">Final Price:</span>
              <span className="text-2xl font-bold text-primary">{product.price.toLocaleString("en-US", {style:"currency", currency:"USD"})}</span>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">Add to Cart 🛒</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
