export default function Spinner({ label = "Cargando..." }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
