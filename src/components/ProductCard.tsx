import { Link } from "react-router-dom";
import type { Producto } from "../types/producto";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ producto }: { producto: Producto }) {
  const { agregar } = useCart();
  const sinStock = producto.stock === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <Link to={`/productos/${producto.id}`} className="p-4 flex-1 flex flex-col">
        <div className="text-5xl mb-3 text-center" aria-hidden="true">
          {producto.imagen}
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 self-start mb-2">
          {producto.categoria}
        </span>
        <h3 className="font-semibold text-slate-800 leading-snug">{producto.nombre}</h3>
        <p className="text-lg font-bold text-slate-900 mt-2">{formatPrice(producto.precio)}</p>
        <p className={`text-xs mt-1 ${sinStock ? "text-rose-600" : "text-slate-500"}`}>
          {sinStock ? "Sin stock" : `Stock: ${producto.stock}`}
        </p>
      </Link>
      <button
        type="button"
        disabled={sinStock}
        onClick={() => {
          agregar(producto);
          toast.success(`${producto.nombre} agregado al carrito`);
        }}
        className="m-3 mt-0 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {sinStock ? "Sin stock" : "Agregar al carrito"}
      </button>
    </div>
  );
}
