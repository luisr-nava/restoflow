import { z } from "zod";

export const CreateStaffSchema = z.object({
  name: z.string().trim().min(1, {
    error: "El nombre es obligatorio",
  }),

  email: z
    .string()
    .trim()
    .email({
      error: "El email no es válido",
    })
    .optional()
    .or(z.literal("")),

  role: z.enum(["WAITER", "KITCHEN"], {
    error: "El rol es obligatorio",
  }),

  pin: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/, {
      error: "El PIN debe tener entre 4 y 6 números",
    }),
  tableIds: z.array(z.string().uuid()).optional(),
});

export const UpdateStaffSchema = z.object({
  staffId: z.string().uuid({
    error: "El personal es obligatorio",
  }),

  name: z.string().trim().min(1, {
    error: "El nombre es obligatorio",
  }),

  email: z
    .string()
    .trim()
    .email({
      error: "El email no es válido",
    })
    .optional()
    .or(z.literal("")),

  role: z.enum(["WAITER", "KITCHEN"], {
    error: "El rol es obligatorio",
  }),

  isActive: z.boolean(),
  pin: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/, {
      error: "El PIN debe tener entre 4 y 6 números",
    })
    .optional()
    .or(z.literal("")),
});

export const DeleteStaffSchema = z.object({
  staffId: z.string().uuid({
    error: "El personal es obligatorio",
  }),
});

