import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  floorRepository,
  IFloorRepository,
} from "../repositories/floor.repository";
import type { CreateFloorInput, DeleteFloorInput } from "../types/floor.types";
import { tableRepository } from "@/src/features/tables/repositories/table.repository";
class FloorService {
  constructor(private readonly floorRepository: IFloorRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async createFloor(input: CreateFloorInput) {
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
          error: "No tenés permisos para crear pisos",
          success: "",
        };
      }

      const { data: existingFloor } =
        await this.floorRepository.findFloorByName(
          supabase,
          member.restaurant_id,
          input.name,
        );

      if (existingFloor) {
        return {
          error: "Ya existe un piso con ese nombre",
          success: "",
        };
      }

      const { data: lastSortOrder } =
        await this.floorRepository.getLastSortOrder(
          supabase,
          member.restaurant_id,
        );

      const nextSortOrder = lastSortOrder ? lastSortOrder.sort_order + 1 : 0;

      const { error } = await this.floorRepository.createFloor(
        supabase,
        member.restaurant_id,
        input.name,
        nextSortOrder,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Piso creado correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear el piso",
        success: "",
      };
    }
  }

  async getFloors() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.floorRepository.findFloorsByRestaurantId(
      supabase,
      member.restaurant_id,
    );

    return data ?? [];
  }

  async deleteFloor(input: DeleteFloorInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
          requiresConfirmation: false,
        };
      }

      if (member.role !== "OWNER" && member.role !== "MANAGER") {
        return {
          error: "No tenés permisos para eliminar pisos",
          success: "",
          requiresConfirmation: false,
        };
      }

      const { data: floor, error: floorError } =
        await this.floorRepository.findFloorById(supabase, input.floorId);

      if (floorError || !floor) {
        return {
          error: floorError?.message || "El piso no existe",
          success: "",
          requiresConfirmation: false,
        };
      }

      if (floor.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para eliminar este piso",
          success: "",
          requiresConfirmation: false,
        };
      }

      const { data: tables, error: tablesError } =
        await tableRepository.findTablesByFloorIdForDelete(
          supabase,
          input.floorId,
        );

      if (tablesError) {
        return {
          error: tablesError.message,
          success: "",
          requiresConfirmation: false,
        };
      }

      const floorTables = tables ?? [];
      const hasActiveTables = floorTables.some(
        (table) => table.status === "OCCUPIED" || table.status === "RESERVED",
      );

      if (hasActiveTables && !input.force) {
        return {
          error:
            "Este piso tiene mesas ocupadas o reservadas. Confirmá para cerrarlas y eliminar el piso.",
          success: "",
          requiresConfirmation: true,
        };
      }

      for (const table of floorTables) {
        if (table.status === "OCCUPIED" || table.status === "RESERVED") {
          const { error } = await tableRepository.updateTableStatus(
            supabase,
            table.id,
            "CLOSED",
          );

          if (error) {
            return {
              error: error.message,
              success: "",
              requiresConfirmation: false,
            };
          }
        }
      }

      const { error: deleteTablesError } =
        await tableRepository.deleteTablesByFloorId(supabase, input.floorId);

      if (deleteTablesError) {
        return {
          error: deleteTablesError.message,
          success: "",
          requiresConfirmation: false,
        };
      }

      const { error: deleteFloorError } =
        await this.floorRepository.deleteFloor(supabase, input.floorId);

      if (deleteFloorError) {
        return {
          error: deleteFloorError.message,
          success: "",
          requiresConfirmation: false,
        };
      }

      return {
        error: "",
        success: "Piso eliminado correctamente",
        requiresConfirmation: false,
      };
    } catch {
      return {
        error: "No se pudo eliminar el piso",
        success: "",
        requiresConfirmation: false,
      };
    }
  }
}

export const floorService = new FloorService(floorRepository);


