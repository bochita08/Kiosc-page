export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="text-center py-16 px-4 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
    >
      <p className="text-2xl mb-2" aria-hidden="true">⚠️</p>
      <p className="font-semibold">Ocurrió un problema</p>
      <p className="text-sm mt-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
