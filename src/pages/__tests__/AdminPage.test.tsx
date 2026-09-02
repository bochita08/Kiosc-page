import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConProviders } from "../../test/testUtils";
import App from "../../App";

describe("AdminPage", () => {
  it("lista los productos en la tabla", async () => {
    renderConProviders(<App />, { ruta: "/admin" });
    await waitFor(() => expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument());
    expect(screen.getAllByRole("row")).toHaveLength(5); // header + 4 productos
  });

  it("pide confirmación antes de eliminar y luego lo saca de la lista", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin" });
    await waitFor(() => screen.getByText("Coca Cola 500ml"));

    const fila = screen.getByText("Coca Cola 500ml").closest("tr") as HTMLElement;
    await user.click(within(fila).getByRole("button", { name: /eliminar/i }));

    const dialogo = await screen.findByRole("dialog");
    expect(within(dialogo).getByText(/eliminar "coca cola 500ml"/i)).toBeInTheDocument();

    await user.click(within(dialogo).getByRole("button", { name: /^eliminar$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Coca Cola 500ml")).not.toBeInTheDocument();
    });
  });

  it("cancelar en el diálogo no elimina el producto", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin" });
    await waitFor(() => screen.getByText("Coca Cola 500ml"));

    const fila = screen.getByText("Coca Cola 500ml").closest("tr") as HTMLElement;
    await user.click(within(fila).getByRole("button", { name: /eliminar/i }));

    const dialogo = await screen.findByRole("dialog");
    await user.click(within(dialogo).getByRole("button", { name: /cancelar/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument();
  });
});
