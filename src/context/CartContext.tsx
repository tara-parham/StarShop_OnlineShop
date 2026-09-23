import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

interface CartProviderProps {
  children: React.ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("starshop_cart");
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem("starshop_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const item = prev.find((searchedItem) => searchedItem.id === product.id);
      if (item) {
        return prev.map((foundedProduct) =>
          foundedProduct.id === product.id
            ? { ...foundedProduct, quantity: foundedProduct.quantity + 1 }
            : foundedProduct,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id: number | string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string | number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quanity: item.quantity + delta } : item,
        )
        .filter((pro) => pro.quantity > 0),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider!");
  }
  return context;
}
