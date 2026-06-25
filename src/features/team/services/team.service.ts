import { createHash } from "crypto";

import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  ITeamRepository,
  teamRepository,
} from "../repositories/team.repository";
import type {
  CreateStaffInput,
  DeleteStaffInput,
  UpdateStaffInput,
} from "../types/team.types";
import { tableRepository } from "../../tables/repositories/table.repository";

class TeamService {
  constructor(private readonly teamRepository: ITeamRepository) {}

  private async getSupabase() {
    return createClient();
  }

  private toError(error: unknown, fallback: string) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(fallback);
  }

  private hashPin(pin: string) {
    return createHash("sha256").update(pin).digest("hex");
  }

  async createStaff(input: CreateStaffInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (member.role !== "OWNER" && member.role !== "MANAGER") {
        return {
          error: "No tenés permisos para crear personal",
          success: "",
        };
      }

      const { data: staff, error } = await this.teamRepository.createStaff(
        supabase,
        {
          restaurantId: member.restaurant_id,
          name: input.name,
          email: input.email || undefined,
          role: input.role,
          pinHash: this.hashPin(input.pin),
        },
      );

      if (error || !staff) {
        return {
          error: error?.message || "No se pudo crear el personal",
          success: "",
        };
      }

      if (
        input.role === "WAITER" &&
        input.tableIds &&
        input.tableIds.length > 0
      ) {
        const { error: assignError } =
          await tableRepository.assignTablesToWaiter(
            supabase,
            input.tableIds,
            staff.id,
          );

        if (assignError) {
          return {
            error: assignError.message,
            success: "",
          };
        }
      }

      return {
        error: "",
        success: "Personal creado correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear el personal",
        success: "",
      };
    }
  }

  async getStaff() {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data, error } = await this.teamRepository.getStaffByRestaurantId(
        supabase,
        member.restaurant_id,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el personal");
    }
  }

  async updateStaff(input: UpdateStaffInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (member.role !== "OWNER" && member.role !== "MANAGER") {
        return {
          error: "No tenés permisos para editar personal",
          success: "",
        };
      }

      const { data: staff, error: staffError } =
        await this.teamRepository.findStaffById(supabase, input.staffId);

      if (staffError || !staff) {
        return {
          error: staffError?.message || "El personal no existe",
          success: "",
        };
      }

      if (staff.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para editar este personal",
          success: "",
        };
      }

      const { error } = await this.teamRepository.updateStaff(supabase, {
        staffId: input.staffId,
        name: input.name,
        email: input.email || undefined,
        role: input.role,
        isActive: input.isActive,
        pinHash: input.pin ? this.hashPin(input.pin) : undefined,
      });

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      if (input.role === "WAITER") {
        const { error: syncTablesError } =
          await tableRepository.syncWaiterTables(
            supabase,
            member.restaurant_id,
            input.staffId,
            input.tableIds ?? [],
          );

        if (syncTablesError) {
          return {
            error: syncTablesError.message,
            success: "",
          };
        }
      }

      if (input.role === "KITCHEN") {
        const { error: syncTablesError } =
          await tableRepository.syncWaiterTables(
            supabase,
            member.restaurant_id,
            input.staffId,
            [],
          );

        if (syncTablesError) {
          return {
            error: syncTablesError.message,
            success: "",
          };
        }
      }

      return {
        error: "",
        success: "Personal actualizado correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar el personal",
        success: "",
      };
    }
  }

  async deleteStaff(input: DeleteStaffInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (member.role !== "OWNER" && member.role !== "MANAGER") {
        return {
          error: "No tenés permisos para eliminar personal",
          success: "",
        };
      }

      const { data: staff, error: staffError } =
        await this.teamRepository.findStaffById(supabase, input.staffId);

      if (staffError || !staff) {
        return {
          error: staffError?.message || "El personal no existe",
          success: "",
        };
      }

      if (staff.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para eliminar este personal",
          success: "",
        };
      }

      const { error } = await this.teamRepository.deleteStaff(supabase, {
        staffId: input.staffId,
      });

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Personal eliminado correctamente",
      };
    } catch {
      return {
        error: "No se pudo eliminar el personal",
        success: "",
      };
    }
  }
}

export const teamService = new TeamService(teamRepository);

