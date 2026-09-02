export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-16 text-slate-500">
      <p className="text-2xl mb-2" aria-hidden="true">🔎</p>
      <p className="font-semibold text-slate-700">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
