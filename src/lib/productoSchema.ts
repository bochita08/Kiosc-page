import { z } from "zod";

// Refleja exactamente las validaciones del backend (server.js) para que el
// usuario vea el error en el formulario en vez de recién al hacer submit.
export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),
  precio: z.coerce
    .number({ message: "El precio debe ser un número" })
    .gt(0, "El precio debe ser un número mayor a 0"),
  stock: z.coerce
    .number({ message: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock debe ser un número entero igual o mayor a 0"),
  categoria: z.string().trim().optional(),
  imagen: z.string().trim().optional(),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;
