import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderConProviders } from "../../test/testUtils";
import App from "../../App";

describe("AdminProductoFormPage - alta", () => {
  it("muestra errores de validación si se envía vacío", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin/nuevo" });

    await user.click(screen.getByRole("button", { name: /crear producto/i }));

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
  });

  it("rechaza precio 0 o negativo", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin/nuevo" });

    await user.type(screen.getByLabelText(/^nombre$/i), "Producto de prueba");
    await user.clear(screen.getByLabelText(/^precio$/i));
    await user.type(screen.getByLabelText(/^precio$/i), "0");
    await user.click(screen.getByRole("button", { name: /crear producto/i }));

    expect(await screen.findByText(/precio debe ser un número mayor a 0/i)).toBeInTheDocument();
  });

  it("crea el producto y vuelve a la lista de administración", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin/nuevo" });

    await user.type(screen.getByLabelText(/^nombre$/i), "Producto Nuevo QA");
    await user.clear(screen.getByLabelText(/^precio$/i));
    await user.type(screen.getByLabelText(/^precio$/i), "999");
    await user.clear(screen.getByLabelText(/^stock$/i));
    await user.type(screen.getByLabelText(/^stock$/i), "7");

    await user.click(screen.getByRole("button", { name: /crear producto/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /administración de productos/i })).toBeInTheDocument();
    });
    expect(await screen.findByText("Producto Nuevo QA")).toBeInTheDocument();
  });
});

describe("AdminProductoFormPage - edición", () => {
  it("precarga los datos del producto existente", async () => {
    renderConProviders(<App />, { ruta: "/admin/1/editar" });

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toHaveValue("Coca Cola 500ml");
    });
    expect(screen.getByLabelText(/^precio$/i)).toHaveValue(2500);
    expect(screen.getByLabelText(/^stock$/i)).toHaveValue(10);
  });

  it("guarda los cambios y vuelve a la lista", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/admin/1/editar" });

    await waitFor(() => expect(screen.getByLabelText(/^nombre$/i)).toHaveValue("Coca Cola 500ml"));

    const inputStock = screen.getByLabelText(/^stock$/i);
    await user.clear(inputStock);
    await user.type(inputStock, "50");

    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /administración de productos/i })).toBeInTheDocument();
    });
  });
});
