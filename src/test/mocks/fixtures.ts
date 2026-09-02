import type { Producto } from "../../types/producto";

// Copia "viva" para los handlers de MSW: cada test puede mutarla (crear/borrar)
// y beforeEach la resetea, simulando el almacenamiento en memoria de la API real.
export function crearProductosFixture(): Producto[] {
  return [
    { id: 1, nombre: "Coca Cola 500ml", precio: 2500, stock: 10, categoria: "Bebidas", imagen: "🥤" },
    { id: 2, nombre: "Alfajor Jorgito", precio: 1200, stock: 25, categoria: "Golosinas", imagen: "🍫" },
    { id: 3, nombre: "Papas Lays", precio: 1800, stock: 15, categoria: "Snacks", imagen: "🍟" },
    { id: 4, nombre: "Agua Mineral 500ml", precio: 1300, stock: 0, categoria: "Bebidas", imagen: "💧" },
  ];
}
