export default function ConfirmDialog({
  abierto,
  titulo,
  descripcion,
  onConfirmar,
  onCancelar,
  confirmando = false,
}: {
  abierto: boolean;
  titulo: string;
  descripcion?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  confirmando?: boolean;
}) {
  if (!abierto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5">
        <h2 id="confirm-dialog-title" className="font-semibold text-slate-800 text-lg">
          {titulo}
        </h2>
        {descripcion && <p className="text-sm text-slate-500 mt-2">{descripcion}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={confirmando}
            className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:bg-slate-300"
          >
            {confirmando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
