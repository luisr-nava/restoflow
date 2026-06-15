"use server";
import { CreateFloorSchema, DeleteFloorSchema } from "../schemas/floor.schema";

import type { CreateFloorInput, DeleteFloorInput } from "../types/floor.types";
import { floorService } from "../services/floor.service";

export async function createFloorAction(input: CreateFloorInput) {
  const data = CreateFloorSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return floorService.createFloor(data.data);
}

export async function getFloorsAction() {
  return floorService.getFloors();
}

export async function deleteFloorAction(input: DeleteFloorInput) {
  const data = DeleteFloorSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
      requiresConfirmation: false,
    };
  }

  return floorService.deleteFloor(data.data);
}

