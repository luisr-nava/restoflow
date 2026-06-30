import { createClient } from "@/src/lib/supabase/server";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";

import {
  IReportRepository,
  reportRepository,
} from "../repositories/report.repository";
import type { ReportsOverview } from "../types/report.types";

class ReportService {
  constructor(private readonly reportRepository: IReportRepository) {}

  private async getSupabase() {
    return createClient();
  }

  private toError(error: unknown, fallback: string) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(fallback);
  }

  private async getRestaurantId() {
    const member = await restaurantService.getCurrentUserRestaurantMember();

    if (!member) {
      throw new Error("No se pudo obtener la membresía del restaurante");
    }

    return member.restaurant_id;
  }

  async getReportsOverview(): Promise<ReportsOverview> {
    const supabase = await this.getSupabase();

    try {
      const restaurantId = await this.getRestaurantId();
      const { data, error } = await this.reportRepository.getReportsOverview(
        supabase,
        restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el resumen de reportes");
    }
  }

  async getSalesSummary() {
    const supabase = await this.getSupabase();

    try {
      const restaurantId = await this.getRestaurantId();

      const { data, error } = await this.reportRepository.getSalesSummary(
        supabase,
        restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el resumen de ventas");
    }
  }

  async getTopProducts() {
    const supabase = await this.getSupabase();

    try {
      const restaurantId = await this.getRestaurantId();

      const { data, error } = await this.reportRepository.getTopProducts(
        supabase,
        restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar los productos vendidos");
    }
  }

  async getTopCategories() {
    const supabase = await this.getSupabase();

    try {
      const restaurantId = await this.getRestaurantId();

      const { data, error } = await this.reportRepository.getTopCategories(
        supabase,
        restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar las categorías vendidas");
    }
  }

  async getPaymentMethods() {
    const supabase = await this.getSupabase();

    try {
      const restaurantId = await this.getRestaurantId();

      const { data, error } = await this.reportRepository.getPaymentMethods(
        supabase,
        restaurantId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar los métodos de pago");
    }
  }
}

export const reportService = new ReportService(reportRepository);
