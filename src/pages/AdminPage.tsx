import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import { useEliminarProducto } from "../hooks/useProductoMutations";
import { formatPrice } from "../utils/formatPrice";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";
import type { Producto } from "../types/producto";
import { ApiError } from "../lib/apiClient";

export default function AdminPage() {
  const { data: productos, isLoading, isError, refetch } = useProductos();
  const eliminarMutation = useEliminarProducto();
  const [aEliminar, setAEliminar] = useState<Producto | null>(null);

  if (isLoading) return <Spinner label="Cargando productos..." />;
  if (isError || !productos) {
    return <ErrorState message="No se pudieron cargar los productos." onRetry={() => refetch()} />;
  }

  const confirmarEliminacion = () => {
    if (!aEliminar) return;
    eliminarMutation.mutate(aEliminar.id, {
      onSuccess: () => {
        toast.success(`"${aEliminar.nombre}" eliminado`);
        setAEliminar(null);
      },
      onError: (error) => {
        const mensaje = error instanceof ApiError ? error.message : "No se pudo eliminar el producto.";
        toast.error(mensaje);
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Administración de productos</h1>
        <Link
          to="/admin/nuevo"
          className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t border-slate-100">
                <td className="px-4 py-2 flex items-center gap-2">
                  <span aria-hidden="true">{producto.imagen}</span>
                  {producto.nombre}
                </td>
                <td className="px-4 py-2 text-slate-500">{producto.categoria}</td>
                <td className="px-4 py-2">{formatPrice(producto.precio)}</td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link
                    to={`/admin/${producto.id}/editar`}
                    className="text-emerald-700 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAEliminar(producto)}
                    className="text-rose-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo={`¿Eliminar "${aEliminar?.nombre}"?`}
        descripcion="Esta acción no se puede deshacer."
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
        confirmando={eliminarMutation.isPending}
      />
    </div>
  );
}
