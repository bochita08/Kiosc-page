import { describe, expect, it } from "vitest";
import { productoSchema } from "../productoSchema";

describe("productoSchema", () => {
  it("acepta datos válidos", () => {
    const resultado = productoSchema.safeParse({
      nombre: "Coca Cola",
      precio: 2500,
      stock: 10,
    });
    expect(resultado.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const resultado = productoSchema.safeParse({ nombre: "  ", precio: 100, stock: 1 });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toMatch(/nombre/i);
    }
  });

  it("rechaza precio menor o igual a 0", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: 0, stock: 1 });
    expect(resultado.success).toBe(false);
  });

  it("rechaza precio negativo", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: -50, stock: 1 });
    expect(resultado.success).toBe(false);
  });

  it("rechaza stock negativo", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: 10, stock: -1 });
    expect(resultado.success).toBe(false);
  });

  it("rechaza stock no entero", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: 10, stock: 1.5 });
    expect(resultado.success).toBe(false);
  });

  it("acepta stock igual a 0 (límite válido)", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: 10, stock: 0 });
    expect(resultado.success).toBe(true);
  });

  it("categoria e imagen son opcionales", () => {
    const resultado = productoSchema.safeParse({ nombre: "X", precio: 10, stock: 0 });
    expect(resultado.success).toBe(true);
  });
});
