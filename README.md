# 🏪 Kiosco Page

Frontend en **React + TypeScript** combinado con a API https://github.com/bochita08/Kiosco---API-postman-swagger-UI-Newman , pensado como proyecto hermano: consume los endpoints REST de `kiosco-api` para mostrar un catálogo navegable, un carrito de compra y un panel de administración con operaciones CRUD completas.

## 📋 Stack técnico

| Capa | Tecnología | Motivo |
| --- | --- | --- |
| Build / dev server | Vite | arranque instantáneo, HMR |
| UI | React 19 + TypeScript | tipado en toda la app, incluidos los datos que vienen de la API |
| Estilos | Tailwind CSS v4 | utilidades, sin CSS a mano |
| Ruteo | React Router v7 | catálogo, detalle, carrito, administración |
| Datos remotos | TanStack React Query | cache, reintentos, invalidación tras mutaciones |
| Formularios | react-hook-form + zod | validación en el cliente calcada de las reglas del backend |
| Notificaciones | react-hot-toast | feedback de éxito/error en mutaciones |
| Testing | Vitest + Testing Library + MSW | unitarios, de componentes e integración simulando la API |
| Linter | oxlint | reglas de React/Hooks |

## 🌐 Demo en vivo

**https://bochita08.github.io/Kiosc-page/**

La demo publicada en GitHub Pages no tiene la Kiosco API detrás: la simula en el navegador con [MSW](https://mswjs.io/) usando los mismos handlers que los tests (`src/demo.ts`, se activa con `VITE_DEMO=1`). Se puede navegar el catálogo, usar el carrito y hacer altas/bajas/modificaciones; los cambios viven en memoria y se pierden al recargar. Cada push a `master` la vuelve a publicar (`.github/workflows/pages.yml`).

## 🔗 Cómo se acopla con kiosco-api

Este proyecto **no tiene backend propio**: todo el catálogo sale de `GET /productos` de kiosco-api, y las altas/bajas/modificaciones pegan directo contra `POST` / `PUT` / `DELETE /productos/:id`. La URL base se configura por variable de entorno (`VITE_API_URL`, ver `.env.example`), por defecto `http://localhost:3000`.

Como parte de este trabajo se hicieron **dos ajustes en kiosco-api** para que la integración funcionara de verdad:

1. **CORS**: se agregó el middleware `cors` (`app.use(cors())`). Sin esto, el navegador bloquea cualquier request de este frontend (otro origen/puerto) contra la API.
2. **Bug de generación de IDs**: `productos.length + 1` podía repetir un ID ya usado por otro producto apenas se borraba algo que no fuera el último elemento (ej: 3 productos, borro el del medio, el próximo alta pisaba un ID existente). Se cambió a `Math.max(...ids) + 1`, verificado con un test manual que borra un producto intermedio y confirma que no quedan IDs duplicados.
3. Se amplió el dataset semilla de 3 a **20 productos** con categoría e imagen (emoji), para que el catálogo tenga contenido real para filtrar/ordenar/buscar.

## 🚀 Puesta en marcha

Se necesitan **dos servidores corriendo en paralelo**: la API y este frontend.

### 1. Levantar la API

```bash
cd ../kiosco-api
npm install
node server.js
```

Debe quedar escuchando en `http://localhost:3000`.

### 2. Levantar este frontend

```bash
cd Kiosco-page
npm install
cp .env.example .env   # si no existe ya
npm run dev
```

Por defecto Vite lo sirve en `http://localhost:5173`.

## 📜 Scripts disponibles

| Script | Qué hace |
| --- | --- |
| `npm run dev` | servidor de desarrollo con hot reload |
| `npm run build` | typecheck (`tsc -b`) + build de producción a `dist/` |
| `npm run preview` | sirve el build de `dist/` para probarlo como en producción |
| `npm run lint` | oxlint sobre todo `src/` |
| `npm run test` | corre toda la suite de Vitest una vez |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:coverage` | suite + reporte de cobertura (`text` + `html`) |

## 🗂️ Estructura

```text
src/
├── components/     # piezas de UI reutilizables (ProductCard, ProductForm, Layout, etc.)
├── context/         # CartContext: carrito con persistencia en localStorage
├── hooks/           # useProductos / useProducto / mutaciones (React Query)
├── lib/             # apiClient (fetch tipado + manejo de errores) y schema de validación (zod)
├── pages/           # una por ruta: Catálogo, Detalle, Carrito, Admin, Admin/Form, 404
├── types/           # tipos compartidos (Producto, ProductoInput)
├── utils/           # formatPrice y demás helpers puros
└── test/            # setup de Vitest + mocks de MSW (server, handlers, fixtures)
```

## 🧭 Funcionalidad

- **Catálogo** (`/`): grilla de productos con búsqueda por nombre, filtro por categoría y orden por precio/nombre. Estados de carga, error (con reintento) y "sin resultados" manejados explícitamente.
- **Detalle de producto** (`/productos/:id`): vista ampliada, agregar al carrito, manejo del caso "no existe" (404 de la API).
- **Carrito** (`/carrito`): cantidad editable por ítem, quitar producto, vaciar, total calculado, persistido en `localStorage` (sobrevive a un refresh).
- **Administración** (`/admin`): tabla con todos los productos, alta (`/admin/nuevo`) y edición (`/admin/:id/editar`) con el mismo formulario validado, baja con diálogo de confirmación.

## 🧪 Testing

La suite corre contra una API **simulada con MSW** (`src/test/mocks`), que replica las mismas validaciones y códigos de estado que el backend real (400 con el mensaje exacto, 404, 204, etc.), así los tests no dependen de tener `kiosco-api` levantada y corren rápido y en forma determinística.

Cobertura actual: **49 tests en 9 archivos**, entre ellos:

- `apiClient`: casos felices, errores 400/404, falla de red (servidor caído) y respuesta no-JSON ante un 500.
- `productoSchema`: cada regla de validación (nombre vacío, precio ≤ 0, stock negativo o no entero) espejando al backend.
- `CartContext`: alta, suma de cantidades al repetir producto, cálculo de total, `quitar`, `vaciar` y persistencia en `localStorage`.
- Páginas completas (`CatalogoPage`, `ProductoDetallePage`, `CarritoPage`, `AdminPage`, `AdminProductoFormPage`) renderizadas con React Router + React Query reales y la API mockeada: búsqueda, filtros, orden, flujo de alta/edición con errores de validación, baja con confirmación, estado de error de red con botón "Reintentar".

```bash
npm run test
```

### Bug encontrado y corregido durante el testing

El input de cantidad del carrito actualizaba el estado en cada `onChange`. Al borrar el campo para escribir un número nuevo (por ejemplo pasar de "1" a "3"), el evento intermedio con el campo vacío mandaba `cantidad = 0`, y como `actualizarCantidad(id, 0)` elimina el ítem, el producto desaparecía del carrito a mitad de la edición. Se corrigió llevando el valor del input a un estado local por fila, que sólo confirma contra el carrito en `onBlur`/`Enter` y valida el número antes de aplicarlo. Quedó cubierto por una prueba de regresión (`CarritoPage.test.tsx`) que borra el campo y verifica que el producto siga en el carrito mientras no se confirme un valor nuevo.

## ⚠️ Notas / limitaciones conocidas

- No hay autenticación: el panel de administración es público, como en la API original. Para un entorno real habría que protegerlo.
- "Finalizar compra" es un simulacro: vacía el carrito y muestra un toast, no hay checkout ni persistencia de pedidos (la API no tiene esos endpoints).
- No se corrió una suite E2E con navegador real (Playwright) contra los dos servidores levantados a la vez; la cobertura actual es de tests unitarios y de integración con Testing Library + MSW, más pruebas manuales con `curl` contra la API real (CORS, CRUD completo, verificación de que el fix de IDs no genera duplicados).
- Dos warnings de lint aceptados a propósito (no son errores): `useCart` exportado junto al `CartProvider` en el mismo archivo, y el `export *` de `src/test/testUtils.tsx`. Ambos son patrones estándar (hook + provider colocados, re-export de Testing Library) que sólo afectan al Fast Refresh en desarrollo, no a la app en producción.
