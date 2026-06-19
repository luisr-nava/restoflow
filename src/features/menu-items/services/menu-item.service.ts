import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { createClient } from "@/src/lib/supabase/server";

import {
  IMenuItemRepository,
  menuItemRepository,
} from "../repositories/menu-item.repository";
import type {
  CreateMenuItemInput,
  DeleteMenuItemInput,
  UpdateMenuItemInput,
} from "../types/menu-item.types";
import { getStaffSession } from "@/src/features/team/lib/staff-session";
class MenuItemService {
  constructor(private readonly menuItemRepository: IMenuItemRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async createMenuItem(input: CreateMenuItemInput) {
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
          error: "No tenés permisos para crear items del menú",
          success: "",
        };
      }

      const { error } = await this.menuItemRepository.createMenuItem(
        supabase,
        member.restaurant_id,
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
        success: "Item creado correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear el item",
        success: "",
      };
    }
  }

  async getMenuItems() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.menuItemRepository.findMenuItemsByRestaurantId(
      supabase,
      member.restaurant_id,
    );

    return data ?? [];
  }

  async updateMenuItem(input: UpdateMenuItemInput) {
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
          error: "No tenés permisos para editar items del menú",
          success: "",
        };
      }

      const { data: menuItem, error: menuItemError } =
        await this.menuItemRepository.findMenuItemById(
          supabase,
          input.menuItemId,
        );

      if (menuItemError || !menuItem) {
        return {
          error: menuItemError?.message || "El item no existe",
          success: "",
        };
      }

      if (menuItem.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar este item",
          success: "",
        };
      }

      const { error } = await this.menuItemRepository.updateMenuItem(
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
        success: "Item actualizado correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar el item",
        success: "",
      };
    }
  }

  async updateAvailability(menuItemId: string, isAvailable: boolean) {
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
          error: "No tenés permisos para cambiar disponibilidad",
          success: "",
        };
      }

      const { data: menuItem, error: menuItemError } =
        await this.menuItemRepository.findMenuItemById(supabase, menuItemId);

      if (menuItemError || !menuItem) {
        return {
          error: menuItemError?.message || "El item no existe",
          success: "",
        };
      }

      if (menuItem.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar este item",
          success: "",
        };
      }

      const { error } = await this.menuItemRepository.updateAvailability(
        supabase,
        menuItem.id,
        isAvailable,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Disponibilidad actualizada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la disponibilidad",
        success: "",
      };
    }
  }

  async deleteMenuItem(input: DeleteMenuItemInput) {
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
          error: "No tenés permisos para eliminar items del menú",
          success: "",
        };
      }

      const { data: menuItem, error: menuItemError } =
        await this.menuItemRepository.findMenuItemById(
          supabase,
          input.menuItemId,
        );

      if (menuItemError || !menuItem) {
        return {
          error: menuItemError?.message || "El item no existe",
          success: "",
        };
      }

      if (menuItem.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para eliminar este item",
          success: "",
        };
      }

      const { error } = await this.menuItemRepository.deleteMenuItem(
        supabase,
        menuItem.id,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Item eliminado correctamente",
      };
    } catch {
      return {
        error: "No se pudo eliminar el item",
        success: "",
      };
    }
  }
  async getMenuItemsByStaffSession() {
    const supabase = await this.getSupabase();

    const session = await getStaffSession();

    if (!session) {
      return [];
    }

    const { data } = await this.menuItemRepository.findMenuItemsByRestaurantId(
      supabase,
      session.restaurantId,
    );

    return data ?? [];
  }
}

export const menuItemService = new MenuItemService(menuItemRepository);

