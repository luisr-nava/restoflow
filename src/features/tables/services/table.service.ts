import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  ITableRepository,
  tableRepository,
} from "../repositories/table.repository";
import type {
  CreateTableInput,
  UpdateTableInput,
  UpdateTablePositionInput,
} from "../types/table.types";

class TableService {
  constructor(private readonly tableRepository: ITableRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async createTable(input: CreateTableInput) {
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
          error: "No tenés permisos para crear mesas",
          success: "",
        };
      }

      const { error } = await this.tableRepository.createTable(supabase, {
        restaurantId: member.restaurant_id,
        floorId: input.floorId,
        waiterId: input.waiterId || undefined,
        name: input.name,
        seats: input.seats,
      });

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Mesa creada correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear la mesa",
        success: "",
      };
    }
  }

  async updateTablePosition(input: UpdateTablePositionInput) {
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
          error: "No tenés permisos para mover mesas",
          success: "",
        };
      }

      const { data: table, error: tableError } =
        await this.tableRepository.findTableById(supabase, input.tableId);

      if (tableError || !table) {
        return {
          error: tableError?.message || "La mesa no existe",
          success: "",
        };
      }

      if (table.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar esta mesa",
          success: "",
        };
      }

      const { error } = await this.tableRepository.updateTablePosition(
        supabase,
        input,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Mesa actualizada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la mesa",
        success: "",
      };
    }
  }

  async getTablesByFloorId(floorId: string) {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.tableRepository.findTablesByFloorId(
      supabase,
      floorId,
    );

    return data ?? [];
  }

  async updateTable(input: UpdateTableInput) {
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
          error: "No tenés permisos para editar mesas",
          success: "",
        };
      }

      const { data: table, error: tableError } =
        await this.tableRepository.findTableById(supabase, input.tableId);

      if (tableError || !table) {
        return {
          error: tableError?.message || "La mesa no existe",
          success: "",
        };
      }

      if (table.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar esta mesa",
          success: "",
        };
      }

      const { error } = await this.tableRepository.updateTable(supabase, input);

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Mesa actualizada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la mesa",
        success: "",
      };
    }
  }

  async deleteTable(tableId: string) {
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
          error: "No tenés permisos para eliminar mesas",
          success: "",
        };
      }

      const { data: table, error: tableError } =
        await this.tableRepository.findTableById(supabase, tableId);

      if (tableError || !table) {
        return {
          error: tableError?.message || "La mesa no existe",
          success: "",
        };
      }

      if (table.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para eliminar esta mesa",
          success: "",
        };
      }

      if (table.status !== "AVAILABLE") {
        return {
          error: "Sólo se pueden eliminar mesas disponibles",
          success: "",
        };
      }

      const { error } = await this.tableRepository.deleteTable(
        supabase,
        table.id,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Mesa eliminada correctamente",
      };
    } catch {
      return {
        error: "No se pudo eliminar la mesa",
        success: "",
      };
    }
  }
  async getTableByQrToken(qrToken: string) {
    const supabase = await this.getSupabase();

    if (!qrToken) {
      return null;
    }

    const { data } = await this.tableRepository.findTableByQrToken(
      supabase,
      qrToken,
    );

    return data;
  }
}




export const tableService = new TableService(tableRepository);