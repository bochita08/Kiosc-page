import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productosApi } from "../lib/apiClient";
import type { ProductoInput } from "../types/producto";
import { PRODUCTOS_QUERY_KEY } from "./useProductos";

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductoInput) => productosApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}

export function useActualizarProducto(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductoInput) => productosApi.actualizar(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["productos", id] });
    },
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productosApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}
