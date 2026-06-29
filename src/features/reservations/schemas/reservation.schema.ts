import { z } from "zod";

export const ReservationStatusSchema = z.enum(
  ["ACTIVE", "CANCELED", "COMPLETED"],
  {
    error: "El estado es obligatorio",
  },
);

export const CreateReservationSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),

  customerName: z
    .string()
    .trim()
    .min(1, { error: "El nombre del cliente es obligatorio" })
    .max(120, {
      error: "El nombre del cliente no puede superar los 120 caracteres",
    }),

  customerPhone: z
    .string()
    .trim()
    .min(1, { error: "El telefono del cliente es obligatorio" })
    .max(30, {
      error: "El telefono del cliente no puede superar los 30 caracteres",
    }),

  partySize: z.coerce
    .number()
    .int({ error: "La cantidad de personas debe ser un numero entero" })
    .min(1, { error: "La reserva debe tener al menos 1 persona" }),

  startsAt: z.string().trim().min(1, {
    error: "La fecha de inicio es obligatoria",
  }),

  durationMinutes: z.coerce
    .number()
    .int({ error: "La duracion debe ser un numero entero" })
    .min(15, { error: "La duracion minima es de 15 minutos" }),

  notes: z
    .string()
    .trim()
    .max(300, { error: "La nota no puede superar los 300 caracteres" })
    .optional()
    .or(z.literal("")),
});

export const UpdateReservationSchema = CreateReservationSchema.extend({
  reservationId: z.string().uuid({ error: "La reserva es obligatoria" }),
  status: ReservationStatusSchema,
});

export const CancelReservationSchema = z.object({
  reservationId: z.string().uuid({ error: "La reserva es obligatoria" }),
});
