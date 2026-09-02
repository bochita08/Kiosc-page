import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, type ItemCarrito } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";

export default function CarritoPage() {
  const { items, actualizarCantidad, quitar, vaciar, total } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Tu carrito</h1>
        <EmptyState
          title="Todavía no agregaste productos"
          description="Volvé al catálogo y elegí lo que necesites."
        />
        <Link to="/" className="inline-block mt-4 text-emerald-700 hover:underline text-sm">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Tu carrito</h1>

      <ul className="space-y-3 max-w-2xl">
        {items.map((item) => (
          <FilaCarrito
            key={item.producto.id}
            item={item}
            onActualizarCantidad={actualizarCantidad}
            onQuitar={quitar}
          />
        ))}
      </ul>

      <div className="max-w-2xl mt-6 flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
        <button
          type="button"
          onClick={vaciar}
          className="text-sm text-slate-500 hover:text-rose-600"
        >
          Vaciar carrito
        </button>
        <div className="text-right">
          <p className="text-sm text-slate-500">Total</p>
          <p data-testid="cart-total" className="text-2xl font-bold text-slate-900">
            {formatPrice(total)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          toast.success("¡Gracias por tu compra! (simulado, no hay checkout real)");
          vaciar();
        }}
        className="mt-4 px-5 py-2.5 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700"
      >
        Finalizar compra
      </button>
    </div>
  );
}

interface FilaCarritoProps {
  item: ItemCarrito;
  onActualizarCantidad: (productoId: number, cantidad: number) => void;
  onQuitar: (productoId: number) => void;
}

/**
 * Fila del carrito con estado local para el input de cantidad.
 *
 * Ojo con esto: si actualizáramos el carrito en cada onChange usando
 * directamente el valor del input, borrar el campo para escribir un número
 * nuevo (ej: pasar de "1" a "3") dispara un onChange intermedio con "" -> 0,
 * y actualizarCantidad(id, 0) borra el producto del carrito antes de que el
 * usuario termine de escribir. Por eso el input maneja un string local propio
 * y sólo confirma contra el carrito en onBlur (o Enter), validando el valor.
 */
function FilaCarrito({ item, onActualizarCantidad, onQuitar }: FilaCarritoProps) {
  const { producto, cantidad } = item;
  // Estado local sólo para el valor "en edición" del input. Se inicializa una
  // única vez con la cantidad actual; no necesita re-sincronizarse desde
  // afuera porque la única forma de cambiar `cantidad` es a través de
  // confirmarCantidad() de este mismo componente (que también actualiza
  // valorInput), o "Quitar"/"Vaciar", que directamente desmontan la fila.
  const [valorInput, setValorInput] = useState(String(cantidad));

  const confirmarCantidad = () => {
    const numero = Number(valorInput);
    if (!Number.isFinite(numero) || numero <= 0) {
      // Valor inválido o vacío: no borramos silenciosamente, volvemos a la cantidad actual.
      setValorInput(String(cantidad));
      return;
    }
    const limitado = Math.min(numero, producto.stock);
    onActualizarCantidad(producto.id, limitado);
    setValorInput(String(limitado));
  };

  return (
    <li className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4">
      <span className="text-3xl" aria-hidden="true">
        {producto.imagen}
      </span>
      <div className="flex-1">
        <p className="font-medium text-slate-800">{producto.nombre}</p>
        <p className="text-sm text-slate-500">{formatPrice(producto.precio)} c/u</p>
      </div>
      <input
        type="number"
        min={1}
        max={producto.stock}
        value={valorInput}
        aria-label={`Cantidad de ${producto.nombre}`}
        onChange={(e) => setValorInput(e.target.value)}
        onBlur={confirmarCantidad}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            confirmarCantidad();
          }
        }}
        className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm text-center"
      />
      <p className="font-semibold text-slate-800 w-24 text-right">
        {formatPrice(producto.precio * cantidad)}
      </p>
      <button
        type="button"
        onClick={() => onQuitar(producto.id)}
        aria-label={`Quitar ${producto.nombre} del carrito`}
        className="text-rose-600 hover:text-rose-800 text-sm font-medium"
      >
        Quitar
      </button>
    </li>
  );
}
