import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import { productosApi, ApiError } from "../apiClient";

describe("apiClient", () => {
  it("listar() devuelve el array de productos", async () => {
    const productos = await productosApi.listar();
    expect(productos.length).toBeGreaterThan(0);
    expect(productos[0]).toHaveProperty("nombre");
  });

  it("obtener() devuelve un producto por id", async () => {
    const producto = await productosApi.obtener(1);
    expect(producto.id).toBe(1);
  });

  it("obtener() con id inexistente lanza ApiError 404", async () => {
    await expect(productosApi.obtener(9999)).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
    });
  });

  it("crear() con datos inválidos lanza ApiError 400 con el mensaje del backend", async () => {
    await expect(
      productosApi.crear({ nombre: "", precio: 10, stock: 1 })
    ).rejects.toThrow(/nombre es obligatorio/i);
  });

  it("crear() con datos válidos devuelve el producto creado con id", async () => {
    const nuevo = await productosApi.crear({ nombre: "Test", precio: 500, stock: 2 });
    expect(nuevo.id).toBeGreaterThan(0);
    expect(nuevo.categoria).toBe("General");
  });

  it("eliminar() de un producto inexistente lanza ApiError 404", async () => {
    await expect(productosApi.eliminar(9999)).rejects.toMatchObject({ status: 404 });
  });

  it("si la API no responde (network error), lanza ApiError con status 0", async () => {
    server.use(
      http.get("http://localhost:3000/productos", () => HttpResponse.error())
    );

    await expect(productosApi.listar()).rejects.toBeInstanceOf(ApiError);
    await expect(productosApi.listar()).rejects.toMatchObject({ status: 0 });
  });

  it("ante un 500 sin body JSON válido, no rompe y lanza un ApiError genérico", async () => {
    server.use(
      http.get("http://localhost:3000/productos", () => new HttpResponse("oops", { status: 500 }))
    );

    await expect(productosApi.listar()).rejects.toMatchObject({ status: 500 });
  });
});
