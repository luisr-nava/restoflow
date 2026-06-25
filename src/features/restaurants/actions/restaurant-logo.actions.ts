"use server";

import { OptionalRestaurantLogoFileSchema } from "../schemas/restaurant-logo.schema";
import { restaurantLogoService } from "../services/restaurant-logo.service";

export async function uploadRestaurantLogoAction(file?: File) {
  const data = OptionalRestaurantLogoFileSchema.safeParse(file);

  if (!data.success) {
    return {
      data: null,
      error: data.error.issues[0]?.message ?? "Archivo inválido",
    };
  }

  if (!data.data) {
    return {
      data: null,
      error: "",
    };
  }

  try {
    const result = await restaurantLogoService.uploadLogo({
      file: data.data,
    });

    return {
      data: result,
      error: "",
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "No se pudo subir el logo",
    };
  }
}

export async function deleteRestaurantLogoAction(publicUrl: string) {
  try {
    await restaurantLogoService.deleteLogo({
      publicUrl,
    });

    return {
      error: "",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "No se pudo eliminar el logo",
    };
  }

}