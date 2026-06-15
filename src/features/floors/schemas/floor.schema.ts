import { z } from "zod";

export const CreateFloorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "El nombre del piso es obligatorio" })
    .max(60, { error: "El nombre no puede superar los 60 caracteres" }),
});

export const DeleteFloorSchema = z.object({
  floorId: z.string().uuid({ error: "El piso es obligatorio" }),
  force: z.boolean().default(false),

});