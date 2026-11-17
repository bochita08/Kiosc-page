import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { iniciarDemo } from "./demo";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

await iniciarDemo();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
          <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
);
