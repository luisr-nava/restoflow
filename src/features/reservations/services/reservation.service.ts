import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { createClient } from "@/src/lib/supabase/server";

import {
  IReservationRepository,
  reservationRepository,
} from "../repositories/reservation.repository";
import type {
  CancelReservationInput,
  CreateReservationInput,
  ReservationWithTable,
  UpdateReservationInput,
} from "../types/reservation.types";

class ReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
  ) {}

  private async getSupabase() {
    return createClient();
  }

  private canManageReservations(role: string) {
    return role === "OWNER" || role === "MANAGER";
  }

  private getReservationTimeRange(
    startsAtInput: string,
    durationMinutes: number,
  ) {
    const startsAt = new Date(startsAtInput);

    if (Number.isNaN(startsAt.getTime())) {
      return {
        data: null,
        error: "La fecha de inicio de la reserva es inválida",
      };
    }

    const endsAt = new Date(
      startsAt.getTime() + durationMinutes * 60 * 1000,
    );

    if (endsAt.getTime() <= startsAt.getTime()) {
      return {
        data: null,
        error: "La fecha de fin debe ser posterior al inicio",
      };
    }

    return {
      data: {
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      },
      error: "",
    };
  }

  private async validateReservationTable(
    supabase: Awaited<ReturnType<ReservationService["getSupabase"]>>,
    tableId: string,
    restaurantId: string,
    requireActiveReservationTable: boolean,
  ) {
    const { data: table, error } = await this.reservationRepository.findTableById(
      supabase,
      tableId,
    );

    if (error || !table) {
      return {
        data: null,
        error: error?.message || "La mesa no existe",
      };
    }

    if (table.restaurant_id !== restaurantId) {
      return {
        data: null,
        error: "La mesa no pertenece al restaurante actual",
      };
    }

    if (requireActiveReservationTable && table.status === "CLOSED") {
      return {
        data: null,
        error: "No se puede reservar una mesa cerrada",
      };
    }

    return {
      data: table,
      error: "",
    };
  }

  private async ensureNoActiveOverlap(input: {
    supabase: Awaited<ReturnType<ReservationService["getSupabase"]>>;
    tableId: string;
    startsAt: string;
    endsAt: string;
    excludeReservationId?: string;
  }) {
    const { data: overlappingReservation, error } =
      await this.reservationRepository.findReservationOverlapping(
        input.supabase,
        {
          tableId: input.tableId,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
          excludeReservationId: input.excludeReservationId,
          statuses: ["ACTIVE"],
        },
      );

    if (error) {
      return {
        error: error.message,
      };
    }

    if (overlappingReservation) {
      return {
        error: "Ya existe una reserva activa que se solapa con ese horario",
      };
    }

    return {
      error: "",
    };
  }

  async createReservation(input: CreateReservationInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (!this.canManageReservations(member.role)) {
        return {
          error: "No tenés permisos para crear reservas",
          success: "",
        };
      }

      const timeRange = this.getReservationTimeRange(
        input.startsAt,
        input.durationMinutes,
      );

      if (!timeRange.data) {
        return {
          error: timeRange.error,
          success: "",
        };
      }

      const { error: tableValidationError } = await this.validateReservationTable(
        supabase,
        input.tableId,
        member.restaurant_id,
        true,
      );

      if (tableValidationError) {
        return {
          error: tableValidationError,
          success: "",
        };
      }

      const { error: overlapError } = await this.ensureNoActiveOverlap({
        supabase,
        tableId: input.tableId,
        startsAt: timeRange.data.startsAt,
        endsAt: timeRange.data.endsAt,
      });

      if (overlapError) {
        return {
          error: overlapError,
          success: "",
        };
      }

      const { error } = await this.reservationRepository.createReservation(
        supabase,
        {
          ...input,
          startsAt: timeRange.data.startsAt,
          endsAt: timeRange.data.endsAt,
          restaurantId: member.restaurant_id,
        },
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Reserva creada correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear la reserva",
        success: "",
      };
    }
  }

  async updateReservation(input: UpdateReservationInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (!this.canManageReservations(member.role)) {
        return {
          error: "No tenés permisos para editar reservas",
          success: "",
        };
      }

      const { data: reservation, error: reservationError } =
        await this.reservationRepository.findReservationById(
          supabase,
          input.reservationId,
        );

      if (reservationError || !reservation) {
        return {
          error: reservationError?.message || "La reserva no existe",
          success: "",
        };
      }

      if (reservation.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para editar esta reserva",
          success: "",
        };
      }

      const timeRange = this.getReservationTimeRange(
        input.startsAt,
        input.durationMinutes,
      );

      if (!timeRange.data) {
        return {
          error: timeRange.error,
          success: "",
        };
      }

      const requiresActiveReservationTable = input.status === "ACTIVE";

      const { error: tableValidationError } = await this.validateReservationTable(
        supabase,
        input.tableId,
        member.restaurant_id,
        requiresActiveReservationTable,
      );

      if (tableValidationError) {
        return {
          error: tableValidationError,
          success: "",
        };
      }

      if (input.status === "ACTIVE") {
        const { error: overlapError } = await this.ensureNoActiveOverlap({
          supabase,
          tableId: input.tableId,
          startsAt: timeRange.data.startsAt,
          endsAt: timeRange.data.endsAt,
          excludeReservationId: input.reservationId,
        });

        if (overlapError) {
          return {
            error: overlapError,
            success: "",
          };
        }
      }

      const { error } = await this.reservationRepository.updateReservation(
        supabase,
        {
          ...input,
          startsAt: timeRange.data.startsAt,
          endsAt: timeRange.data.endsAt,
        },
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Reserva actualizada correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar la reserva",
        success: "",
      };
    }
  }

  async cancelReservation(input: CancelReservationInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      if (!this.canManageReservations(member.role)) {
        return {
          error: "No tenés permisos para cancelar reservas",
          success: "",
        };
      }

      const { data: reservation, error: reservationError } =
        await this.reservationRepository.findReservationById(
          supabase,
          input.reservationId,
        );

      if (reservationError || !reservation) {
        return {
          error: reservationError?.message || "La reserva no existe",
          success: "",
        };
      }

      if (reservation.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para cancelar esta reserva",
          success: "",
        };
      }

      const { error } = await this.reservationRepository.cancelReservation(
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
        success: "Reserva cancelada correctamente",
      };
    } catch {
      return {
        error: "No se pudo cancelar la reserva",
        success: "",
      };
    }
  }

  async getReservations(): Promise<ReservationWithTable[]> {
    const supabase = await this.getSupabase();

    const member =
      await restaurantService.getCurrentUserRestaurantMember(supabase);

    if (!member) {
      throw new Error("El usuario no pertenece a un restaurante");
    }

    const { data, error } =
      await this.reservationRepository.findReservationsByRestaurantId(
        supabase,
        member.restaurant_id,
      );

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async getTodayReservations(): Promise<ReservationWithTable[]> {
    const supabase = await this.getSupabase();

    const member =
      await restaurantService.getCurrentUserRestaurantMember(supabase);

    if (!member) {
      throw new Error("El usuario no pertenece a un restaurante");
    }

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const { data, error } =
      await this.reservationRepository.findTodayReservationsByRestaurantId(
        supabase,
        {
          restaurantId: member.restaurant_id,
          dayStart: dayStart.toISOString(),
          dayEnd: dayEnd.toISOString(),
        },
      );

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }
}

export const reservationService = new ReservationService(reservationRepository);
