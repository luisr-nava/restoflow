import { createClient } from "@/src/lib/supabase/server";

import {
  IRestaurantRepository,
  restaurantRepository,
} from "../repositories/restaurant.repository";
import type {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../types/restaurant.types";

class RestaurantService {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  private async getSupabase() {
    return createClient();
  }

  private createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async createRestaurant(input: CreateRestaurantInput) {
    const supabase = await this.getSupabase();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          error: "No hay una sesión activa",
          success: "",
        };
      }

      const { data: existingMember, error: memberError } =
        await this.restaurantRepository.findMemberByUserId(supabase, user.id);

      if (memberError) {
        return {
          error: memberError.message,
          success: "",
        };
      }

      if (existingMember) {
        return {
          error: "El usuario ya pertenece a un restaurante",
          success: "",
        };
      }

      const slug = this.createSlug(input.name);

      const { data: restaurant, error: restaurantError } =
        await this.restaurantRepository.createRestaurant(supabase, {
          ...input,
          slug,
          ownerId: user.id,
        });

      if (restaurantError || !restaurant) {
        return {
          error: restaurantError?.message || "No se pudo crear el restaurante",
          success: "",
        };
      }

      const { error: memberCreateError } =
        await this.restaurantRepository.createRestaurantMember(
          supabase,
          restaurant.id,
          user.id,
          "OWNER",
        );

      if (memberCreateError) {
        return {
          error: memberCreateError.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Restaurante creado correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear el restaurante",
        success: "",
      };
    }
  }

  async getCurrentUserRestaurantMember() {
    const supabase = await this.getSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data } = await this.restaurantRepository.findMemberByUserId(
      supabase,
      user.id,
    );

    return data;
  }

  async getRestaurantSettings() {
    const supabase = await this.getSupabase();

    const member = await this.getCurrentUserRestaurantMember();

    if (!member) {
      return {
        data: null,
        error: "No se encontró el restaurante",
      };
    }

    const { data, error } = await this.restaurantRepository.findRestaurantById(
      supabase,
      member.restaurant_id,
    );

    if (error) {
      return {
        data: null,
        error: error.message,
      };
    }

    return {
      data,
      error: "",
    };
  }

  async updateRestaurantSettings(input: UpdateRestaurantInput) {
    const supabase = await this.getSupabase();

    const member = await this.getCurrentUserRestaurantMember();

    if (!member) {
      return {
        error: "No se encontró el restaurante",
        success: "",
      };
    }

    if (member.role !== "OWNER" && member.role !== "MANAGER") {
      return {
        error: "No tenés permisos para editar el restaurante",
        success: "",
      };
    }

    const { error } = await this.restaurantRepository.updateRestaurant(
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
      success: "Configuración actualizada correctamente",
    };
  }
}

export const restaurantService = new RestaurantService(restaurantRepository);

