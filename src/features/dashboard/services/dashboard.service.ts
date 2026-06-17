import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import { dashboardRepository } from "../repositories/dashboard.repository";
import { createClient } from "@/src/lib/supabase/server";

class DashboardService {
  async getDashboardData() {
    const supabase = await createClient();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return {
        data: null,
        error: new Error("No se encontró el restaurante."),
      };
    }

    return dashboardRepository.getDashboardData(supabase, member.restaurant_id);
  }
}

export const dashboardService = new DashboardService();

