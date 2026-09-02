export type Orden = "relevancia" | "precio-asc" | "precio-desc" | "nombre-asc";

const OPCIONES: { value: Orden; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre-asc", label: "Nombre: A-Z" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: Orden;
  onChange: (value: Orden) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Orden)}
      aria-label="Ordenar productos"
      className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      {OPCIONES.map((opcion) => (
        <option key={opcion.value} value={opcion.value}>
          {opcion.label}
        </option>
      ))}
    </select>
  );
}
