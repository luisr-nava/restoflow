import { NextResponse } from "next/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

export async function GET() {
  try {
    const settings = await restaurantService.getRestaurantSettings();

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar la configuración del restaurante",
      },
      {
        status: 500,
      },
    );
  }
}
