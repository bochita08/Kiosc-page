import type { Producto, ProductoInput } from "../types/producto";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extraerMensajeDeError(data: unknown): string | null {
  if (data && typeof data === "object" && "error" in data) {
    const valor = (data as { error: unknown }).error;
    if (typeof valor === "string" && valor.trim() !== "") {
      return valor;
    }
  }
  return null;
}

async function manejarRespuesta<T>(res: Response): Promise<T> {
  // 204 No Content (DELETE) no tiene body
  if (res.status === 204) {
    return undefined as T;
  }

  const texto = await res.text();
  let data: unknown = null;
  if (texto) {
    try {
      data = JSON.parse(texto);
    } catch {
      // El body no era JSON válido (ej: un 500 con HTML/texto plano). No
      // dejamos que el SyntaxError se propague sin status: lo tratamos
      // como un error de API normal usando el status code de la respuesta.
      data = null;
    }
  }

  if (!res.ok) {
    const mensaje = extraerMensajeDeError(data) ?? `Error ${res.status} al comunicarse con la API`;
    throw new ApiError(mensaje, res.status);
  }

  return data as T;
}

async function pedido<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con la API del kiosco. ¿Está corriendo en " + BASE_URL + "?",
      0
    );
  }
  return manejarRespuesta<T>(res);
}

export const productosApi = {
  listar: () => pedido<Producto[]>("/productos"),

  obtener: (id: number) => pedido<Producto>(`/productos/${id}`),

  crear: (input: ProductoInput) =>
    pedido<Producto>("/productos", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  actualizar: (id: number, input: ProductoInput) =>
    pedido<Producto>(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  eliminar: (id: number) =>
    pedido<void>(`/productos/${id}`, {
      method: "DELETE",
    }),
};
