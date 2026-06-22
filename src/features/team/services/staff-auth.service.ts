import { createHash } from "crypto";

import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

import {
  IStaffAuthRepository,
  staffAuthRepository,
} from "../repositories/staff-auth.repository";
import type { StaffLoginInput, StaffSession } from "../types/staff-auth.types";

class StaffAuthService {
  constructor(private readonly staffAuthRepository: IStaffAuthRepository) {}

  private hashPin(pin: string) {
    return createHash("sha256").update(pin).digest("hex");
  }

  async login(input: StaffLoginInput): Promise<{
    data: StaffSession | null;
    error: string;
  }> {
    const supabase = createServiceRoleClient();

    try {
      const { data: staff, error } =
        await this.staffAuthRepository.findStaffByEmail(supabase, input.email);

      if (error || !staff) {
        return {
          data: null,
          error: "Credenciales inválidas",
        };
      }

      if (!staff.is_active) {
        return {
          data: null,
          error: "El usuario se encuentra inactivo",
        };
      }

      const pinHash = this.hashPin(input.pin);

      if (pinHash !== staff.pin_hash) {
        return {
          data: null,
          error: "Credenciales inválidas",
        };
      }

      return {
        data: {
          id: staff.id,
          restaurantId: staff.restaurant_id,
          name: staff.name,
          email: staff.email ?? "",
          role: staff.role,
        },
        error: "",
      };
    } catch {
      return {
        data: null,
        error: "No fue posible iniciar sesión",
      };
    }
  }
}

export const staffAuthService = new StaffAuthService(staffAuthRepository);

