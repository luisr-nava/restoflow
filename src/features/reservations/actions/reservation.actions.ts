"use server";

import { z } from "zod";

import {
  CancelReservationSchema,
  CreateReservationSchema,
  UpdateReservationSchema,
} from "../schemas/reservation.schema";
import { reservationService } from "../services/reservation.service";
import type {
  CancelReservationInput,
  CreateReservationInput,
  UpdateReservationInput,
} from "../types/reservation.types";

export async function createReservationAction(input: CreateReservationInput) {
  const data = CreateReservationSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return reservationService.createReservation(data.data);
}

export async function updateReservationAction(input: UpdateReservationInput) {
  const data = UpdateReservationSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return reservationService.updateReservation(data.data);
}

export async function cancelReservationAction(input: CancelReservationInput) {
  const data = CancelReservationSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return reservationService.cancelReservation(data.data);
}

export async function getReservationsAction() {
  const data = z.undefined().safeParse(undefined);

  if (!data.success) {
    return [];
  }

  return reservationService.getReservations();
}

export async function getTodayReservationsAction() {
  const data = z.undefined().safeParse(undefined);

  if (!data.success) {
    return [];
  }

  return reservationService.getTodayReservations();
}
