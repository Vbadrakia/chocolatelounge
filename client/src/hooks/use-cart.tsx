import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { OrderItem } from "@shared/schema";
import { useToast } from "../hooks/use-toast"; // Updated import path

type CartContextType = {
  cartItems: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: OrderItem) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.productId === newItem.productId);
      if (existingItem) {
        return items.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...items, newItem];
    });

    toast({
      title: "Added to cart",
      description: `${newItem.quantity}x ${newItem.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((items) => items.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
