import { z } from "zod";

export const CreateMenuCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "El nombre es obligatorio" })
    .max(60, { error: "El nombre no puede superar los 60 caracteres" }),
});

export const UpdateMenuCategorySchema = CreateMenuCategorySchema.extend({
  categoryId: z.string().uuid({ error: "La categoría es obligatoria" }),
});
