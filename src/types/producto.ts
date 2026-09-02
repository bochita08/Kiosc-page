export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

/**
 * Datos que el usuario completa en el formulario de alta/edición.
 * categoria e imagen son opcionales: si no se completan, la API
 * asigna "General" y "🛒" por defecto.
 */
export interface ProductoInput {
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

export const CATEGORIAS_SUGERIDAS = [
  "Bebidas",
  "Snacks",
  "Golosinas",
  "Cigarrillos",
  "Almacén",
  "Lácteos",
  "Higiene",
  "General",
] as const;
