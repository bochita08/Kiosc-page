import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConProviders } from "../../test/testUtils";
import App from "../../App";

describe("ProductoDetallePage", () => {
  it("muestra el detalle del producto", async () => {
    renderConProviders(<App />, { ruta: "/productos/1" });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Coca Cola 500ml" })).toBeInTheDocument();
    });
    expect(screen.getByText(/stock disponible: 10/i)).toBeInTheDocument();
  });

  it("agregar al carrito desde el detalle actualiza el badge del header", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/productos/1" });

    await waitFor(() => screen.getByRole("heading", { name: "Coca Cola 500ml" }));
    await user.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(await screen.findByTestId("cart-badge")).toHaveTextContent("1");
  });

  it("muestra un mensaje claro cuando el producto no existe (404)", async () => {
    renderConProviders(<App />, { ruta: "/productos/9999" });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/no existe o fue eliminado/i)).toBeInTheDocument();
  });
});
