import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { createClient } from "@/src/lib/supabase/server";
import { extname } from "path";
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
      let imageUrl = input.imageUrl;

      if (input.imageFile) {
        imageUrl = await this.uploadImage(
          supabase,
          member.restaurant_id,
          input.imageFile,
        );
      }
      const { error } = await this.menuItemRepository.createMenuItem(
        supabase,
        member.restaurant_id,
        {
          ...input,
          imageUrl,
        },
      );

      if (error) {
        if (imageUrl) {
          try {
            await this.deleteImage(supabase, imageUrl);
          } catch {
            // No bloqueamos la respuesta si falla la limpieza de la imagen subida.
          }
        }

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

    const { data, error } =
      await this.menuItemRepository.findMenuItemsByRestaurantId(
        supabase,
        member.restaurant_id,
      );

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async getMenuItemsByStaffSession() {
    const supabase = await this.getSupabase();

    const session = await getStaffSession();

    if (!session) {
      return [];
    }

    const { data, error } =
      await this.menuItemRepository.findMenuItemsByRestaurantId(
        supabase,
        session.restaurantId,
      );

    if (error) {
      throw new Error(error.message);
    }

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

      let imageUrl = input.imageUrl;

      if (input.imageFile) {
        imageUrl = await this.uploadImage(
          supabase,
          member.restaurant_id,
          input.imageFile,
        );
      }

      const { error } = await this.menuItemRepository.updateMenuItem(supabase, {
        ...input,
        imageUrl,
      });

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      const previousImageUrl = menuItem.image_url;
      const nextImageUrl = imageUrl || null;

      if (previousImageUrl && previousImageUrl !== nextImageUrl) {
        try {
          await this.deleteImage(supabase, previousImageUrl);
        } catch {
          // No bloqueamos la actualización si falla la limpieza del archivo anterior.
        }
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

      if (menuItem.image_url) {
        try {
          await this.deleteImage(supabase, menuItem.image_url);
        } catch {
          // No bloqueamos la eliminación del item si falla la limpieza de la imagen.
        }
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

  private createMenuItemImagePath(restaurantId: string, file: File) {
    const extension = extname(file.name);
    const fileName = `${crypto.randomUUID()}${extension}`;

    return `restaurants/${restaurantId}/menu-items/${fileName}`;
  }

  private getPathFromPublicUrl(publicUrl: string) {
    const marker = "/object/public/menu-item-images/";

    const [, path] = publicUrl.split(marker);

    return path ?? "";
  }

  private async uploadImage(
    supabase: Awaited<ReturnType<MenuItemService["getSupabase"]>>,
    restaurantId: string,
    file: File,
  ) {
    const storagePath = this.createMenuItemImagePath(restaurantId, file);

    const uploadResult = await this.menuItemRepository.uploadImage(
      supabase,
      storagePath,
      file,
    );

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    return this.menuItemRepository.getImagePublicUrl(
      supabase,
      uploadResult.path,
    );
  }

  private async deleteImage(
    supabase: Awaited<ReturnType<MenuItemService["getSupabase"]>>,
    publicUrl: string,
  ) {
    const path = this.getPathFromPublicUrl(publicUrl);

    if (!path) {
      return;
    }

    const result = await this.menuItemRepository.removeImage(supabase, path);

    if (result.error) {
      throw result.error;
    }
  }
}

export const menuItemService = new MenuItemService(menuItemRepository);

