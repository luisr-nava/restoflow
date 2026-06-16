import { z } from "zod";

export const CreateMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "El nombre es obligatorio" })
    .max(80, { error: "El nombre no puede superar los 80 caracteres" }),

  description: z
    .string()
    .trim()
    .max(300, { error: "La descripción no puede superar los 300 caracteres" })
    .optional()
    .or(z.literal("")),

  price: z.coerce.number().positive({ error: "El precio debe ser mayor a 0" }),

  categoryId: z.string().uuid().optional().or(z.literal("")),

  imageUrl: z
    .string()
    .url({ error: "La imagen debe ser una URL válida" })
    .optional()
    .or(z.literal("")),

  isAvailable: z.boolean().default(true),
});

export const UpdateMenuItemSchema = CreateMenuItemSchema.extend({
  menuItemId: z.string().uuid({ error: "El item es obligatorio" }),
});

export const DeleteMenuItemSchema = z.object({
  menuItemId: z.string().uuid({ error: "El item es obligatorio" }),

});