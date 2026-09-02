import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";
import clsx from "clsx";

const enlaces = [
  { to: "/", label: "Catálogo", end: true },
  { to: "/carrito", label: "Carrito" },
  { to: "/admin", label: "Administración" },
];

export default function Layout() {
  const { cantidadTotal } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <span aria-hidden="true">🏪</span>
            <span>Kiosco Page</span>
          </NavLink>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                end={enlace.end}
                className={({ isActive }) =>
                  clsx(
                    "px-3 py-2 rounded-md transition-colors",
                    isActive ? "bg-emerald-900" : "hover:bg-emerald-600"
                  )
                }
              >
                {enlace.label === "Carrito" ? (
                  <span className="inline-flex items-center gap-1">
                    Carrito
                    {cantidadTotal > 0 && (
                      <span
                        data-testid="cart-badge"
                        className="bg-amber-400 text-emerald-950 text-xs font-bold rounded-full px-2 py-0.5"
                      >
                        {cantidadTotal}
                      </span>
                    )}
                  </span>
                ) : (
                  enlace.label
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        Kiosco Page · Frontend de práctica que consume la Kiosco API
      </footer>
    </div>
  );
}
