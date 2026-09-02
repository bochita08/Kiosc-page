import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";
import type { Producto } from "../../types/producto";

const productoA: Producto = {
  id: 1,
  nombre: "Coca Cola",
  precio: 2500,
  stock: 10,
  categoria: "Bebidas",
  imagen: "🥤",
};

const productoB: Producto = {
  id: 2,
  nombre: "Alfajor",
  precio: 1200,
  stock: 25,
  categoria: "Golosinas",
  imagen: "🍫",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  it("arranca vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("agrega un producto nuevo con cantidad 1 por defecto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(1);
    expect(result.current.cantidadTotal).toBe(1);
  });

  it("si agrego el mismo producto de nuevo, suma cantidad en vez de duplicar la fila", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA));
    act(() => result.current.agregar(productoA));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });

  it("calcula el total correctamente con varios productos", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA, 2)); // 2 * 2500 = 5000
    act(() => result.current.agregar(productoB, 3)); // 3 * 1200 = 3600
    expect(result.current.total).toBe(8600);
    expect(result.current.cantidadTotal).toBe(5);
  });

  it("actualizarCantidad a 0 elimina el item (no lo deja en cantidad 0)", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA));
    act(() => result.current.actualizarCantidad(productoA.id, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("quitar elimina el producto correcto y deja el resto intacto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA));
    act(() => result.current.agregar(productoB));
    act(() => result.current.quitar(productoA.id));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].producto.id).toBe(productoB.id);
  });

  it("vaciar deja el carrito en cero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA));
    act(() => result.current.agregar(productoB));
    act(() => result.current.vaciar());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("persiste en localStorage y lo recupera en una nueva instancia", () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(productoA, 3));
    unmount();

    const { result: result2 } = renderHook(() => useCart(), { wrapper });
    expect(result2.current.items).toHaveLength(1);
    expect(result2.current.items[0].cantidad).toBe(3);
  });
});
