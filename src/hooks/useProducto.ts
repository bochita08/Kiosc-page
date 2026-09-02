import { useQuery } from "@tanstack/react-query";
import { productosApi } from "../lib/apiClient";

export function useProducto(id: number | undefined) {
  return useQuery({
    queryKey: ["productos", id],
    queryFn: () => productosApi.obtener(id as number),
    enabled: id !== undefined && Number.isInteger(id) && id > 0,
    retry: false,
  });
}
