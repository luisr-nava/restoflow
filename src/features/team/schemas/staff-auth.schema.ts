import { z } from "zod";

export const StaffLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Ingresá un email válido"),

  pin: z
    .string()
    .trim()
    .min(4, "El PIN debe tener al menos 4 dígitos")
    .max(8, "El PIN no puede superar los 8 dígitos"),
});
