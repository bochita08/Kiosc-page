import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4" aria-hidden="true">🧭</p>
      <h1 className="text-2xl font-bold text-slate-800">Página no encontrada</h1>
      <p className="text-slate-500 mt-2">La ruta a la que intentaste acceder no existe.</p>
      <Link to="/" className="inline-block mt-5 text-emerald-700 hover:underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
