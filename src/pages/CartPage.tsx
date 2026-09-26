import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { formatPrice } from "../utils/formatPrice";

export function CartPage() {
  const { cart, removeFromCart, totalPrice, updateQuantity } = useCart();
  const shippingPrice = totalPrice > 100 || totalPrice === 0 ? 0 : 15;
  const taxPrice = totalPrice * 0.08;
  const finalPrice = totalPrice + shippingPrice + taxPrice;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-rose-700 rounded-full flex items-center justify-center mb-6 text-slate-200">
          <ShoppingBag size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl text-slate-900 font-bold mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-slate-500 max-w-lg mb-8">
          Looks like you haven't added anything to your cart yet. Explore our
          products and find something you like!
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-primary hover:bg-primaryHover text-white font-md rounded-xl shadow-lg transition-all shadow-primary/50"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-rose-950 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-rose-100 border border-rose-950 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center w-full sm:w-auto gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-primary"
                />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-700">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                <div className="flex items-center gap-1">
                  <Button onClick={() => updateQuantity(item.id, 1)} size="sm">
                    +
                  </Button>
                  <span className="w-8 text-center font-medium text-xl">
                    {item.quantity}
                  </span>
                  <Button onClick={() => updateQuantity(item.id, -1)} size="sm">
                    -
                  </Button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold w-24">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <Button onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={20} strokeWidth={2} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-rose-900 mb-6">
              Order Summary
            </h2>
            <div className="text-sm space-y-4 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span
                  className={`font-semibold ${shippingPrice === 0 ? "text-emerald-600" : "text-slate-800"}`}
                >
                  {shippingPrice === 0 ? "Free" : formatPrice(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice(taxPrice)}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-4 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-slate-950 text-xl">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>
            <Button className="w-full mt-6 py-3.5 shadow-lg" onClick={() => alert("Checkout feature coming soon!")}>
              Proceed to Checkout
            </Button>
            <div className="mt-6 text-center">
              <Link className="border border-primary py-2 px-4 rounded-full  text-slate-900 transition-colors hover:bg-primary hover:text-white" to="/products">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
