import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProductForm from "../components/ProductForm";
import Spinner from "../components/Spinner";
import ErrorState from "../components/ErrorState";
import { useProducto } from "../hooks/useProducto";
import { useActualizarProducto, useCrearProducto } from "../hooks/useProductoMutations";
import { ApiError } from "../lib/apiClient";
import type { ProductoFormValues } from "../lib/productoSchema";

export default function AdminProductoFormPage() {
  const { id } = useParams<{ id: string }>();
  const esEdicion = id !== undefined;
  const idNum = Number(id);
  const navigate = useNavigate();

  const productoQuery = useProducto(esEdicion ? idNum : undefined);
  const crearMutation = useCrearProducto();
  const actualizarMutation = useActualizarProducto(idNum);

  if (esEdicion && productoQuery.isLoading) {
    return <Spinner label="Cargando producto..." />;
  }

  if (esEdicion && (productoQuery.isError || !productoQuery.data)) {
    return <ErrorState message="No se pudo cargar el producto a editar." />;
  }

  const manejarEnvio = (valores: ProductoFormValues) => {
    const input = {
      nombre: valores.nombre,
      precio: valores.precio,
      stock: valores.stock,
      categoria: valores.categoria || undefined,
      imagen: valores.imagen || undefined,
    };

    const mutacion = esEdicion ? actualizarMutation : crearMutation;

    mutacion.mutate(input, {
      onSuccess: () => {
        toast.success(esEdicion ? "Producto actualizado" : "Producto creado");
        navigate("/admin");
      },
      onError: (error) => {
        const mensaje = error instanceof ApiError ? error.message : "Ocurrió un error al guardar.";
        toast.error(mensaje);
      },
    });
  };

  const enviando = esEdicion ? actualizarMutation.isPending : crearMutation.isPending;

  return (
    <div>
      <Link to="/admin" className="text-sm text-emerald-700 hover:underline mb-4 inline-block">
        ← Volver a administración
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        {esEdicion ? "Editar producto" : "Nuevo producto"}
      </h1>
      <ProductForm
        valoresIniciales={esEdicion ? productoQuery.data : undefined}
        onSubmit={manejarEnvio}
        enviando={enviando}
        textoBoton={esEdicion ? "Guardar cambios" : "Crear producto"}
      />
    </div>
  );
}
