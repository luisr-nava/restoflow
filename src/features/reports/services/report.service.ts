import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  IReportRepository,
  reportRepository,
} from "../repositories/report.repository";

class ReportService {
  constructor(private readonly reportRepository: IReportRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async getSalesSummary() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return null;
    }

    const { data } = await this.reportRepository.getSalesSummary(
      supabase,
      member.restaurant_id,
    );

    return data;
  }

  async getTopProducts() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.reportRepository.getTopProducts(
      supabase,
      member.restaurant_id,
    );

    return data;
  }

  async getTopCategories() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.reportRepository.getTopCategories(
      supabase,
      member.restaurant_id,
    );

    return data;
  }

  async getPaymentMethods() {
    const supabase = await this.getSupabase();

    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      return [];
    }

    const { data } = await this.reportRepository.getPaymentMethods(
      supabase,
      member.restaurant_id,
    );

    return data;
  }
}

export const reportService = new ReportService(reportRepository);
