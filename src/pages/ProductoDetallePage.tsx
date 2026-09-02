import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducto } from "../hooks/useProducto";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import { ApiError } from "../lib/apiClient";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import toast from "react-hot-toast";

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const idNum = Number(id);
  const navigate = useNavigate();
  const { agregar } = useCart();

  const { data: producto, isLoading, isError, error, refetch } = useProducto(idNum);

  if (isLoading) return <Spinner label="Cargando producto..." />;

  if (isError || !producto) {
    const mensaje =
      error instanceof ApiError && error.status === 404
        ? "El producto que buscás no existe o fue eliminado."
        : "No se pudo cargar el producto.";
    return <ErrorState message={mensaje} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm text-emerald-700 hover:underline mb-4"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 max-w-2xl">
        <div className="text-8xl text-center" aria-hidden="true">
          {producto.imagen}
        </div>
        <div className="flex-1">
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
            {producto.categoria}
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">{producto.nombre}</h1>
          <p className="text-3xl font-bold text-slate-900 mt-3">{formatPrice(producto.precio)}</p>
          <p className={`text-sm mt-2 ${producto.stock === 0 ? "text-rose-600" : "text-slate-500"}`}>
            {producto.stock === 0 ? "Sin stock disponible" : `Stock disponible: ${producto.stock}`}
          </p>

          <button
            type="button"
            disabled={producto.stock === 0}
            onClick={() => {
              agregar(producto);
              toast.success(`${producto.nombre} agregado al carrito`);
            }}
            className="mt-5 px-5 py-2.5 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:bg-slate-300"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <Link to="/" className="inline-block mt-6 text-sm text-emerald-700 hover:underline">
        Seguir viendo el catálogo
      </Link>
    </div>
  );
}
