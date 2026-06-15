"use server";

import { CreateRestaurantSchema } from "../schemas/restaurant.schema";
import { restaurantService } from "../services/restaurant.service";
import type { CreateRestaurantInput } from "../types/restaurant.types";

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

