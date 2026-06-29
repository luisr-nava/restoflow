import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  ITableRepository,
  tableRepository,
} from "../repositories/table.repository";
import type {
  CreateTableInput,
  UpdateTableReservationStatusInput,
  UpdateTableInput,
  UpdateTablePositionInput,
} from "../types/table.types";
import { getStaffSession } from "../../team/lib/staff-session";

const TABLE_START_X = 24;
const TABLE_START_Y = 24;
const TABLE_GAP_X = 140;
const TABLE_GAP_Y = 120;
const TABLES_PER_ROW = 4;

class TableService {
  constructor(private readonly tableRepository: ITableRepository) {}

  private async getSupabase() {
    return createClient();
  }

  private toError(error: unknown, fallback: string) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(fallback);
  }

  private getInitialTablePosition(tableCount: number) {
    return {
      x: TABLE_START_X + (tableCount % TABLES_PER_ROW) * TABLE_GAP_X,
      y: TABLE_START_Y + Math.floor(tableCount / TABLES_PER_ROW) * TABLE_GAP_Y,
    };
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

      const { data: existingTables, error: existingTablesError } =
        await this.tableRepository.findTablesByFloorId(supabase, input.floorId);

      if (existingTablesError) {
        return {
          error: existingTablesError.message,
          success: "",
        };
      }

      const position =
        input.x !== undefined && input.y !== undefined
          ? {
              x: input.x,
              y: input.y,
            }
          : this.getInitialTablePosition(existingTables?.length ?? 0);

      const { error } = await this.tableRepository.createTable(supabase, {
        restaurantId: member.restaurant_id,
        floorId: input.floorId,
        waiterId: input.waiterId || undefined,
        name: input.name,
        seats: input.seats,
        x: position.x,
        y: position.y,
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

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data, error } = await this.tableRepository.findTablesByFloorId(
        supabase,
        floorId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar las mesas del piso");
    }
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

  async updateTableReservationStatus(input: UpdateTableReservationStatusInput) {
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
          error: "No tenés permisos para gestionar reservas",
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

      if (input.status === "RESERVED" && table.status !== "AVAILABLE") {
        return {
          error: "Sólo se pueden reservar mesas disponibles",
          success: "",
        };
      }

      if (input.status === "AVAILABLE" && table.status !== "RESERVED") {
        return {
          error: "Sólo se puede liberar una mesa reservada",
          success: "",
        };
      }

      const { error } = await this.tableRepository.updateTableStatus(
        supabase,
        table.id,
        input.status,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success:
          input.status === "RESERVED"
            ? "Mesa reservada correctamente"
            : "Reserva liberada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la reserva de la mesa",
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
  async getTablesByRestaurantId() {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data, error } = await this.tableRepository.findTablesByRestaurantId(
        supabase,
        member.restaurant_id,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar las mesas");
    }
  }

  async getTablesByStaffSession() {
    const supabase = await this.getSupabase();

    try {
      const session = await getStaffSession();

      if (!session) {
        throw new Error("No hay sesión de personal activa");
      }

      if (session.role !== "WAITER") {
        throw new Error("Sólo los mozos pueden ver sus mesas");
      }

      const { data, error } = await this.tableRepository.findTablesByRestaurantId(
        supabase,
        session.restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar las mesas");
    }
  }
}

export const tableService = new TableService(tableRepository);
