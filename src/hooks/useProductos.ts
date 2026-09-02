import { useQuery } from "@tanstack/react-query";
import { productosApi } from "../lib/apiClient";

export const PRODUCTOS_QUERY_KEY = ["productos"] as const;

export function useProductos() {
  return useQuery({
    queryKey: PRODUCTOS_QUERY_KEY,
    queryFn: productosApi.listar,
  });
}
