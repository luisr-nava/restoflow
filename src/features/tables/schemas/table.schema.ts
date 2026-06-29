import { z } from "zod";

export const CreateTableSchema = z.object({
  floorId: z.string().uuid({ error: "El piso es obligatorio" }),

  name: z
    .string()
    .trim()
    .min(1, { error: "El nombre de la mesa es obligatorio" })
    .max(40, { error: "El nombre no puede superar los 40 caracteres" }),

  seats: z.coerce
    .number()
    .int({ error: "La cantidad de sillas debe ser un número entero" })
    .min(1, { error: "Debe tener al menos 1 silla" })
    .max(30, { error: "No puede superar las 30 sillas" }),

  waiterId: z.string().uuid().optional().or(z.literal("")),
  x: z.coerce.number().int().optional(),
  y: z.coerce.number().int().optional(),
});

export const UpdateTablePositionSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),

  x: z.coerce.number().int(),
  y: z.coerce.number().int(),

  width: z.coerce.number().int().min(60).max(240),
  height: z.coerce.number().int().min(48).max(180),
});
export const UpdateTableSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),

  name: z
    .string()
    .trim()
    .min(1, { error: "El nombre de la mesa es obligatorio" })
    .max(40, { error: "El nombre no puede superar los 40 caracteres" }),

  seats: z.coerce
    .number()
    .int({ error: "La cantidad de sillas debe ser un número entero" })
    .min(1, { error: "Debe tener al menos 1 silla" })
    .max(30, { error: "No puede superar las 30 sillas" }),

  waiterId: z.string().uuid().optional().or(z.literal("")),
});

export const UpdateTableReservationStatusSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),
  status: z.enum(["AVAILABLE", "RESERVED"]),
});
