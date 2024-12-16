import { create } from "zustand";
import { CartType } from "../types/type";
import { CartSchema } from "../schema/productSchema";

type CartState = {
  cart: CartType[];
  addToCart: (product: CartType) => void;
  increaseQuantity: (productId: string) => void; // Aumentar cantidad
  decreaseQuantity: (productId: string) => void; // Disminuir cantidad
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  loadCart: () => void; // Carga el carrito basado en el token
  showWarning: boolean; // Estado para mostrar advertencia
  setShowWarning: (show: boolean) => void; // Función para cambiar el estado de advertencia
};

// Helper para manejar el `localStorage` con claves basadas en el `userId`
const getCartKey = (userId: string) => `cart_${userId}`;

// Helper para obtener el userId del token JWT
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica la carga útil del JWT
    return payload?.id || null; // Devuelve el `id` si está presente
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  showWarning: false,
  setShowWarning: (show) => set({ showWarning: show }),
  // Carga un carrito específico del usuario basado en el token
  loadCart: () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("No se pudo obtener el userId del token");
      return set({ cart: [] });
    }

    try {
      const storedCart = JSON.parse(
        localStorage.getItem(getCartKey(userId)) || "[]"
      ).map((item: CartType) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));
      const validatedCart = CartSchema.array().parse(storedCart);
      set({ cart: validatedCart });
    } catch (error) {
      console.error("Error cargando el carrito:", error);
      set({ cart: [] });
    }
  },

  // Agregar al carrito
  addToCart: (product) =>
    set((state) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No se pudo obtener el userId del token");
        return state;
      }

      const existingProduct = state.cart.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        // Verifica si la cantidad total excede 5
        const totalQuantity = existingProduct.quantity + product.quantity;
        if (totalQuantity > 5) {
          return state; // No actualiza el carrito
        }

        // Si no excede, actualiza la cantidad
        const updatedCart = state.cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: totalQuantity, // Actualiza la cantidad total
              }
            : item
        );

        localStorage.setItem(getCartKey(userId), JSON.stringify(updatedCart));
        return { cart: updatedCart };
      } else {
        // Si no existe, simplemente agrega el producto
        const updatedCart = [...state.cart, product];
        localStorage.setItem(getCartKey(userId), JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }
    }),

  // Incrementar la cantidad
  increaseQuantity: (productId) =>
    set((state) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No se pudo obtener el userId del token");
        return state;
      }

      const updatedCart = state.cart.map((item) => {
        if (item._id === productId) {
          if (item.quantity < 5) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            set({ showWarning: true });
            return item;
          }
        }
        return item;
      });

      localStorage.setItem(getCartKey(userId), JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),
  // Disminuir cantidad
  decreaseQuantity: (productId) =>
    set((state) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No se pudo obtener el userId del token");
        return state;
      }

      const updatedCart = state.cart
        .map((item) => {
          if (item._id === productId) {
            const newQuantity = item.quantity - 1;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null) as CartType[];
      localStorage.setItem(getCartKey(userId), JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  // Eliminar del carrito
  removeFromCart: (productId) =>
    set((state) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No se pudo obtener el userId del token");
        return state;
      }

      const updatedCart = state.cart.filter((item) => item._id !== productId);
      localStorage.setItem(getCartKey(userId), JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  // Limpiar el carrito
  clearCart: () =>
    set(() => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No se pudo obtener el userId del token");
        return { cart: [] };
      }

      localStorage.removeItem(getCartKey(userId));
      return { cart: [] };
    }),
}));
