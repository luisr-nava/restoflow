"use server";

import { CreateRestaurantSchema } from "../schemas/restaurant.schema";
import { restaurantService } from "../services/restaurant.service";
import type { CreateRestaurantInput } from "../types/restaurant.types";
import { UpdateRestaurantSchema } from "../schemas/restaurant.schema";
import type { UpdateRestaurantInput } from "../types/restaurant.types";
export async function createRestaurantAction(input: CreateRestaurantInput) {
  const data = CreateRestaurantSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return restaurantService.createRestaurant(data.data);
}

export async function getRestaurantSettingsAction() {
  return restaurantService.getRestaurantSettings();
}

export async function getStaffRestaurantCurrencyAction() {
  return restaurantService.getStaffRestaurantCurrency();
}

export async function updateRestaurantSettingsAction(
  input: UpdateRestaurantInput,
) {
  const data = UpdateRestaurantSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return restaurantService.updateRestaurantSettings(data.data);
}

