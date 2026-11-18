import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { formatPrice } from "../utils/formatPrice";

export function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    city: "",
    address: "",
    zipcode: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    clearCart();
    setIsSubmitted(true);
  }

  if (cart.length === 0 && !isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-slate-100 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          Add some products before checking out
        </p>
        <Link
          to="/products"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg transition hover:bg-primaryHover"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-gray-700 dark:text-slate-200">
          Demo order complete
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6 mt-4">
          Thank you,{" "}
          <span className="font-semibold text-primary">
            {formData.fullname}
          </span>
          . This is a checkout preview. No order was sent and no payment was
          taken.
        </p>
        <Link
          className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg transition hover:bg-primaryHover"
          to="/products"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-rose-950 dark:text-rose-100 mb-8">
        Checkout
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-rose-50 dark:bg-slate-900 rounded-xl p-6 border-2 shadow-sm space-y-4 border-rose-950 dark:border-slate-700"
        >
          <h2 className="text-lg font-semibold mb-8 text-gray-800 dark:text-slate-100">
            Shipping Information
          </h2>
          <div>
            <label className="block font-medium text-sm text-gray-700 dark:text-slate-200 my-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700 dark:text-slate-200 my-1">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700 dark:text-slate-200 my-1">
              Address
            </label>
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700 dark:text-slate-200 my-1">
              City
            </label>
            <input
              required
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700 dark:text-slate-200 my-1">
              Zipcode
            </label>
            <input
              required
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button type="submit" className="w-full mt-6 py-3 rounded-lg">
            Preview order {formatPrice(totalPrice)}
          </Button>
        </form>

        <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-xl border-2 border-gray-600 h-fit space-y-4">
          <h2 className="text-xl font-semibold text-gray-950 dark:text-slate-100">
            Order Summary
          </h2>
          <div className="divide-y divide-gray-400 max-h-80 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="py-3 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-gray-600 dark:text-slate-300">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-gray-700 dark:text-slate-200">
                  {formatPrice(item.quantity * item.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t-2 pt-4 border-primary flex justify-between text-base font-bold text-gray-900 dark:text-slate-100">
            <span>Total:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
