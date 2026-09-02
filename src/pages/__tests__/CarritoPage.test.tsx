import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConProviders } from "../../test/testUtils";
import App from "../../App";

async function agregarProductoAlCarrito(user: ReturnType<typeof userEvent.setup>) {
  renderConProviders(<App />, { ruta: "/" });
  await waitFor(() => screen.getByText("Coca Cola 500ml"));
  const tarjeta = screen.getByText("Coca Cola 500ml").closest("div.bg-white") as HTMLElement;
  const boton = tarjeta.querySelector("button") as HTMLButtonElement;
  await user.click(boton);
}

describe("CarritoPage", () => {
  it("muestra estado vacío cuando no hay productos agregados", async () => {
    renderConProviders(<App />, { ruta: "/carrito" });
    expect(screen.getByText(/todavía no agregaste productos/i)).toBeInTheDocument();
  });

  it("cambiar la cantidad recalcula el total", async () => {
    const user = userEvent.setup();
    await agregarProductoAlCarrito(user);

    await user.click(screen.getByRole("link", { name: /carrito/i }));
    await waitFor(() => screen.getByText("Coca Cola 500ml"));

    const inputCantidad = screen.getByLabelText(/cantidad de coca cola 500ml/i);
    await user.clear(inputCantidad);
    await user.type(inputCantidad, "3");
    await user.tab(); // dispara el blur, que es cuando se confirma la nueva cantidad

    await waitFor(() => {
      // 3 * 2500 = 7500
      expect(screen.getByTestId("cart-total")).toHaveTextContent(/7\.500/);
    });

    // Además: mientras se estaba editando (input vacío momentáneamente), el
    // producto NO debe haber sido eliminado del carrito.
    expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument();
  });

  it("borrar el campo de cantidad mientras se escribe NO elimina el producto (regresión)", async () => {
    const user = userEvent.setup();
    await agregarProductoAlCarrito(user);

    await user.click(screen.getByRole("link", { name: /carrito/i }));
    await waitFor(() => screen.getByText("Coca Cola 500ml"));

    const inputCantidad = screen.getByLabelText(/cantidad de coca cola 500ml/i);
    await user.clear(inputCantidad);
    // Todavía no hicimos blur ni Enter: el producto tiene que seguir en el carrito.
    expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument();
  });

  it("quitar un producto lo elimina del carrito", async () => {
    const user = userEvent.setup();
    await agregarProductoAlCarrito(user);

    await user.click(screen.getByRole("link", { name: /carrito/i }));
    await waitFor(() => screen.getByText("Coca Cola 500ml"));

    await user.click(screen.getByRole("button", { name: /quitar coca cola 500ml/i }));

    expect(screen.getByText(/todavía no agregaste productos/i)).toBeInTheDocument();
  });
});
