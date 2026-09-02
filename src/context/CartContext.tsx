import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Producto } from "../types/producto";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CartContextValue {
  items: ItemCarrito[];
  agregar: (producto: Producto, cantidad?: number) => void;
  quitar: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  cantidadTotal: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "kiosco-page:carrito";

function leerCarritoInicial(): ItemCarrito[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarritoInicial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage puede no estar disponible (modo privado, etc). No es crítico.
    }
  }, [items]);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }, []);

  const quitar = useCallback((productoId: number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i))
    );
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const cantidadTotal = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad * i.producto.precio, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, agregar, quitar, actualizarCantidad, vaciar, cantidadTotal, total }),
    [items, agregar, quitar, actualizarCantidad, vaciar, cantidadTotal, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>");
  }
  return ctx;
}
