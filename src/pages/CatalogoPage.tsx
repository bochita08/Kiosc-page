import { useMemo, useState } from "react";
import { useProductos } from "../hooks/useProductos";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortSelect, { type Orden } from "../components/SortSelect";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { ApiError } from "../lib/apiClient";

export default function CatalogoPage() {
  const { data: productos, isLoading, isError, error, refetch } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState<Orden>("relevancia");

  const categorias = useMemo(() => {
    if (!productos) return [];
    return Array.from(new Set(productos.map((p) => p.categoria))).sort();
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (!productos) return [];

    let resultado = productos;

    const termino = busqueda.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(termino));
    }

    if (categoria) {
      resultado = resultado.filter((p) => p.categoria === categoria);
    }

    resultado = [...resultado];
    if (orden === "precio-asc") resultado.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") resultado.sort((a, b) => b.precio - a.precio);
    if (orden === "nombre-asc") resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return resultado;
  }, [productos, busqueda, categoria, orden]);

  if (isLoading) return <Spinner label="Cargando productos..." />;

  if (isError) {
    const mensaje = error instanceof ApiError ? error.message : "No se pudieron cargar los productos.";
    return <ErrorState message={mensaje} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Catálogo</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={busqueda} onChange={setBusqueda} />
        </div>
        <CategoryFilter categorias={categorias} value={categoria} onChange={setCategoria} />
        <SortSelect value={orden} onChange={setOrden} />
      </div>

      {productosFiltrados.length === 0 ? (
        <EmptyState
          title="No encontramos productos"
          description="Probá con otra búsqueda o cambiá el filtro de categoría."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
