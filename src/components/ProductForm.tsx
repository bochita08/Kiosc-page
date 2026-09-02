import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoFormValues } from "../lib/productoSchema";
import { CATEGORIAS_SUGERIDAS } from "../types/producto";

interface ProductFormProps {
  valoresIniciales?: Partial<ProductoFormValues>;
  onSubmit: (valores: ProductoFormValues) => void;
  enviando?: boolean;
  textoBoton?: string;
}

export default function ProductForm({
  valoresIniciales,
  onSubmit,
  enviando = false,
  textoBoton = "Guardar",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: valoresIniciales?.nombre ?? "",
      precio: valoresIniciales?.precio ?? 0,
      stock: valoresIniciales?.stock ?? 0,
      categoria: valoresIniciales?.categoria ?? "",
      imagen: valoresIniciales?.imagen ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md" noValidate>
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
          Nombre
        </label>
        <input
          id="nombre"
          {...register("nombre")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {errors.nombre && (
          <p role="alert" className="text-rose-600 text-xs mt-1">
            {errors.nombre.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-slate-700 mb-1">
            Precio
          </label>
          <input
            id="precio"
            type="number"
            step="0.01"
            {...register("precio")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.precio && (
            <p role="alert" className="text-rose-600 text-xs mt-1">
              {errors.precio.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            {...register("stock")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.stock && (
            <p role="alert" className="text-rose-600 text-xs mt-1">
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">
          Categoría <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          id="categoria"
          list="categorias-sugeridas"
          {...register("categoria")}
          placeholder="General"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <datalist id="categorias-sugeridas">
          {CATEGORIAS_SUGERIDAS.map((categoria) => (
            <option key={categoria} value={categoria} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="imagen" className="block text-sm font-medium text-slate-700 mb-1">
          Ícono/emoji <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          id="imagen"
          {...register("imagen")}
          placeholder="🛒"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-slate-300"
      >
        {enviando ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
