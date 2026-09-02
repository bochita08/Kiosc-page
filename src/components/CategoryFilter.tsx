export default function CategoryFilter({
  categorias,
  value,
  onChange,
}: {
  categorias: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filtrar por categoría"
      className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value="">Todas las categorías</option>
      {categorias.map((categoria) => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      ))}
    </select>
  );
}
