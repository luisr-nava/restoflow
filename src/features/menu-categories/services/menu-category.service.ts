import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  IMenuCategoryRepository,
  menuCategoryRepository,
} from "../repositories/menu-category.repository";

import type {
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
} from "../types/menu-category.types";
import { menuItemRepository } from "@/src/features/menu-items/repositories/menu-item.repository";

class MenuCategoryService {
  constructor(
    private readonly menuCategoryRepository: IMenuCategoryRepository,
  ) {}

  private async getSupabase() {
    return createClient();
  }

  async createCategory(input: CreateMenuCategoryInput) {
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
          error: "No tenés permisos para crear categorías",
          success: "",
        };
      }

      const { data: existingCategory } =
        await this.menuCategoryRepository.findCategoryByName(
          supabase,
          member.restaurant_id,
          input.name,
        );

      if (existingCategory) {
        return {
          error: "Ya existe una categoría con ese nombre",
          success: "",
        };
      }

      const { data: lastSortOrder } =
        await this.menuCategoryRepository.getLastSortOrder(
          supabase,
          member.restaurant_id,
        );

      const nextSortOrder = lastSortOrder ? lastSortOrder.sort_order + 1 : 0;

      const { error } = await this.menuCategoryRepository.createCategory(
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
        success: "Categoría creada correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear la categoría",
        success: "",
      };
    }
  }

  async getCategories() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } =
      await this.menuCategoryRepository.findCategoriesByRestaurantId(
        supabase,
        member.restaurant_id,
      );

    return data ?? [];
  }

  async updateCategory(input: UpdateMenuCategoryInput) {
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
          error: "No tenés permisos para editar categorías",
          success: "",
        };
      }

      const { data: category, error: categoryError } =
        await this.menuCategoryRepository.findCategoryById(
          supabase,
          input.categoryId,
        );

      if (categoryError || !category) {
        return {
          error: categoryError?.message || "La categoría no existe",
          success: "",
        };
      }

      if (category.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar esta categoría",
          success: "",
        };
      }

      const { error } = await this.menuCategoryRepository.updateCategory(
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
        success: "Categoría actualizada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la categoría",
        success: "",
      };
    }
  }

  async updateCategoryStatus(categoryId: string, isActive: boolean) {
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
          error: "No tenés permisos para modificar categorías",
          success: "",
        };
      }

      const { data: category, error: categoryError } =
        await this.menuCategoryRepository.findCategoryById(
          supabase,
          categoryId,
        );

      if (categoryError || !category) {
        return {
          error: categoryError?.message || "La categoría no existe",
          success: "",
        };
      }

      if (category.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar esta categoría",
          success: "",
        };
      }

      const { error } = await this.menuCategoryRepository.updateCategoryStatus(
        supabase,
        categoryId,
        isActive,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Estado actualizado correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar el estado",
        success: "",
      };
    }
  }
  async deleteCategory(categoryId: string) {
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
          error: "No tenés permisos para eliminar categorías",
          success: "",
        };
      }

      const { data: category, error: categoryError } =
        await this.menuCategoryRepository.findCategoryById(
          supabase,
          categoryId,
        );

      if (categoryError || !category) {
        return {
          error: categoryError?.message || "La categoría no existe",
          success: "",
        };
      }

      if (category.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para eliminar esta categoría",
          success: "",
        };
      }

      const { count, error: countError } =
        await menuItemRepository.countItemsByCategoryId(supabase, category.id);

      if (countError) {
        return {
          error: countError.message,
          success: "",
        };
      }

      if ((count ?? 0) > 0) {
        return {
          error:
            "La categoría tiene productos asociados. Cambiá esos productos de categoría antes de eliminarla.",
          success: "",
        };
      }

      const { error } = await this.menuCategoryRepository.deleteCategory(
        supabase,
        category.id,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Categoría eliminada correctamente",
      };
    } catch {
      return {
        error: "No se pudo eliminar la categoría",
        success: "",
      };
    }
  }
}

export const menuCategoryService = new MenuCategoryService(
  menuCategoryRepository,
);


