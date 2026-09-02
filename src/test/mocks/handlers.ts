import { http, HttpResponse } from "msw";
import type { Producto } from "../../types/producto";
import { crearProductosFixture } from "./fixtures";

const BASE_URL = "http://localhost:3000";

export let productosDb: Producto[] = crearProductosFixture();

export function resetProductosDb() {
  productosDb = crearProductosFixture();
}

function siguienteId(): number {
  return productosDb.length === 0 ? 1 : Math.max(...productosDb.map((p) => p.id)) + 1;
}

export const handlers = [
  http.get(`${BASE_URL}/productos`, () => {
    return HttpResponse.json(productosDb);
  }),

  http.get(`${BASE_URL}/productos/:id`, ({ params }) => {
    const id = Number(params.id);
    const producto = productosDb.find((p) => p.id === id);
    if (!producto) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return HttpResponse.json(producto);
  }),

  http.post(`${BASE_URL}/productos`, async ({ request }) => {
    const body = (await request.json()) as Partial<Producto>;

    if (!body.nombre || String(body.nombre).trim() === "") {
      return HttpResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (typeof body.precio !== "number" || body.precio <= 0) {
      return HttpResponse.json(
        { error: "El precio debe ser un número mayor a 0" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(body.stock) || (body.stock as number) < 0) {
      return HttpResponse.json(
        { error: "El stock debe ser un número entero igual o mayor a 0" },
        { status: 400 }
      );
    }

    const nuevo: Producto = {
      id: siguienteId(),
      nombre: body.nombre,
      precio: body.precio,
      stock: body.stock as number,
      categoria: body.categoria || "General",
      imagen: body.imagen || "🛒",
    };
    productosDb.push(nuevo);
    return HttpResponse.json(nuevo, { status: 201 });
  }),

  http.put(`${BASE_URL}/productos/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const producto = productosDb.find((p) => p.id === id);
    if (!producto) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    const body = (await request.json()) as Partial<Producto>;

    if (!body.nombre || String(body.nombre).trim() === "") {
      return HttpResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (typeof body.precio !== "number" || body.precio <= 0) {
      return HttpResponse.json(
        { error: "El precio debe ser un número mayor a 0" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(body.stock) || (body.stock as number) < 0) {
      return HttpResponse.json(
        { error: "El stock debe ser un número entero igual o mayor a 0" },
        { status: 400 }
      );
    }

    producto.nombre = body.nombre;
    producto.precio = body.precio;
    producto.stock = body.stock as number;
    if (body.categoria !== undefined) producto.categoria = body.categoria;
    if (body.imagen !== undefined) producto.imagen = body.imagen;

    return HttpResponse.json(producto);
  }),

  http.delete(`${BASE_URL}/productos/:id`, ({ params }) => {
    const id = Number(params.id);
    const indice = productosDb.findIndex((p) => p.id === id);
    if (indice === -1) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    productosDb.splice(indice, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
