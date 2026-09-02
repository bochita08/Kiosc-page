import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../test/mocks/server";
import { renderConProviders } from "../../test/testUtils";
import App from "../../App";

describe("CatalogoPage", () => {
  it("muestra el spinner y después la lista de productos", async () => {
    renderConProviders(<App />, { ruta: "/" });

    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument();
    });
    expect(screen.getByText("Alfajor Jorgito")).toBeInTheDocument();
  });

  it("filtra por texto de búsqueda", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/" });

    await waitFor(() => expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument());

    await user.type(screen.getByRole("searchbox", { name: /buscar producto/i }), "alfajor");

    expect(screen.getByText("Alfajor Jorgito")).toBeInTheDocument();
    expect(screen.queryByText("Coca Cola 500ml")).not.toBeInTheDocument();
  });

  it("filtra por categoría", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/" });

    await waitFor(() => expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument());

    await user.selectOptions(screen.getByLabelText(/filtrar por categoría/i), "Snacks");

    expect(screen.getByText("Papas Lays")).toBeInTheDocument();
    expect(screen.queryByText("Coca Cola 500ml")).not.toBeInTheDocument();
  });

  it("ordena por precio de menor a mayor", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/" });

    await waitFor(() => expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument());

    await user.selectOptions(screen.getByLabelText(/ordenar productos/i), "precio-asc");

    const nombres = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);
    // Precios: Alfajor 1200, Papas 1800, Agua 1300, Coca 2500 -> orden esperado
    expect(nombres).toEqual([
      "Alfajor Jorgito",
      "Agua Mineral 500ml",
      "Papas Lays",
      "Coca Cola 500ml",
    ]);
  });

  it("muestra un estado vacío si la búsqueda no matchea nada", async () => {
    const user = userEvent.setup();
    renderConProviders(<App />, { ruta: "/" });

    await waitFor(() => expect(screen.getByText("Coca Cola 500ml")).toBeInTheDocument());
    await user.type(screen.getByRole("searchbox", { name: /buscar producto/i }), "producto-inexistente-zzz");

    expect(screen.getByText(/no encontramos productos/i)).toBeInTheDocument();
  });

  it("muestra un producto sin stock como deshabilitado", async () => {
    renderConProviders(<App />, { ruta: "/" });
    await waitFor(() => expect(screen.getByText("Agua Mineral 500ml")).toBeInTheDocument());

    const card = screen.getByText("Agua Mineral 500ml").closest("div.bg-white") as HTMLElement;
    const boton = within(card).getByRole("button");
    expect(boton).toBeDisabled();
    expect(boton).toHaveTextContent(/sin stock/i);
  });

  it("muestra estado de error con botón reintentar si la API falla", async () => {
    server.use(
      http.get("http://localhost:3000/productos", () => HttpResponse.error())
    );

    renderConProviders(<App />, { ruta: "/" });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument();
  });
});
