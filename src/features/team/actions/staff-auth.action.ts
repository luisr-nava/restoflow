"use server";

import { StaffLoginSchema } from "../schemas/staff-auth.schema";
import { staffAuthService } from "../services/staff-auth.service";
import { clearStaffSession, setStaffSession } from "../lib/staff-session";
import type { StaffLoginInput } from "../types/staff-auth.types";

export async function staffLoginAction(input: StaffLoginInput) {
  const data = StaffLoginSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
      role: null,
    };
  }

  const result = await staffAuthService.login(data.data);

  if (result.error || !result.data) {
    return {
      error: result.error,
      success: "",
      role: null,
    };
  }

  await setStaffSession(result.data);

  return {
    error: "",
    success: "Sesión iniciada correctamente",
    role: result.data.role,
  };
}

export async function staffLogoutAction() {
  await clearStaffSession();

  return {
    error: "",
    success: "Sesión cerrada correctamente",
  };

}