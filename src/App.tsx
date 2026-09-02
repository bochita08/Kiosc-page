import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CatalogoPage from "./pages/CatalogoPage";
import ProductoDetallePage from "./pages/ProductoDetallePage";
import CarritoPage from "./pages/CarritoPage";
import AdminPage from "./pages/AdminPage";
import AdminProductoFormPage from "./pages/AdminProductoFormPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogoPage />} />
        <Route path="productos/:id" element={<ProductoDetallePage />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/nuevo" element={<AdminProductoFormPage />} />
        <Route path="admin/:id/editar" element={<AdminProductoFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
