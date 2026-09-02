import { describe, expect, it } from "vitest";
import { formatPrice } from "../formatPrice";

describe("formatPrice", () => {
  it("formatea un número entero como moneda ARS", () => {
    const resultado = formatPrice(2500);
    // Intl puede usar espacio normal o NBSP entre símbolo y monto según el runtime,
    // por eso verificamos las partes clave en vez de una igualdad exacta de string.
    expect(resultado).toContain("2.500");
    expect(resultado).toMatch(/\$/);
  });

  it("formatea el cero correctamente", () => {
    expect(formatPrice(0)).toContain("0");
  });

  it("no rompe con números grandes", () => {
    expect(formatPrice(1234567)).toContain("1.234.567");
  });
});
