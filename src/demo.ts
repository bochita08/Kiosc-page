// Modo demo (build de GitHub Pages): no hay Kiosco API corriendo, así que la API
// se simula en el navegador con MSW usando los mismos handlers que los tests.
// Los cambios viven en memoria y se pierden al recargar.
export async function iniciarDemo(): Promise<void> {
  if (import.meta.env.VITE_DEMO !== "1") return;
  const { setupWorker } = await import("msw/browser");
  const { crearHandlers } = await import("./test/mocks/handlers");
  const apiUrl = import.meta.env.VITE_API_URL ?? "";
  await setupWorker(...crearHandlers(apiUrl)).start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}
