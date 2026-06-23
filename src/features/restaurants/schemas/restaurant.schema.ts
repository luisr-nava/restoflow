import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "El nombre del restaurante es obligatorio" })
    .max(80, { error: "El nombre no puede superar los 80 caracteres" }),

  address: z
    .string()
    .trim()
    .min(5, { error: "La dirección es obligatoria" })
    .max(160, { error: "La dirección no puede superar los 160 caracteres" }),

  phone: z
    .string()
    .trim()
    .max(25, { error: "El teléfono no puede superar los 25 caracteres" })
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email({ error: "El e-mail no es válido" })
    .optional()
    .or(z.literal("")),

  taxId: z
    .string()
    .trim()
    .max(30, { error: "El CUIT / Tax ID no puede superar los 30 caracteres" })
    .optional()
    .or(z.literal("")),

  currency: z.string().trim().min(1, { error: "La moneda es obligatoria" }),

  timezone: z
    .string()
    .trim()
    .min(1, { error: "La zona horaria es obligatoria" }),

  logoUrl: z.string().optional().or(z.literal("")),
});


export const UpdateRestaurantSchema = CreateRestaurantSchema;
