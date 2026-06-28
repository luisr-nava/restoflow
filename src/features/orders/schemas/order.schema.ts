import { z } from "zod";

export const CreateOrderItemSchema = z.object({
  menuItemId: z.string().uuid({ error: "El item del menú es obligatorio" }),

  quantity: z.coerce
    .number()
    .int({ error: "La cantidad debe ser un número entero" })
    .min(1, { error: "La cantidad mínima es 1" })
    .max(99, { error: "La cantidad máxima es 99" }),

  notes: z
    .string()
    .trim()
    .max(300, { error: "La nota no puede superar los 300 caracteres" })
    .optional()
    .or(z.literal("")),
});

export const CreateTableOrderSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),

  items: z
    .array(CreateOrderItemSchema)
    .min(1, { error: "El pedido debe tener al menos un item" }),

  notes: z
    .string()
    .trim()
    .max(300, { error: "La nota no puede superar los 300 caracteres" })
    .optional()
    .or(z.literal("")),
});

export const CloseTableSchema = z.object({
  tableId: z.string().uuid({ error: "La mesa es obligatoria" }),

  method: z.enum(["CASH", "CARD", "TRANSFER", "ACCOUNT"], {
    error: "El método de pago es obligatorio",
  }),

  paidAmount: z.coerce.number().min(0).optional(),

  changeAmount: z.coerce.number().min(0).optional(),
});

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid({ error: "El pedido es obligatorio" }),

  status: z.enum(["ACCEPTED", "PREPARING", "READY", "SERVED"], {
    error: "El estado es obligatorio",
  }),
});

export const CreateQrTableOrderSchema = CreateTableOrderSchema.extend({
  qrToken: z.string().trim().min(1, {
    error: "El token QR es obligatorio",
  }),
});

