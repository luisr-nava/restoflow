"use server";

import { teamService } from "../services/team.service";
import {
  CreateStaffSchema,
  DeleteStaffSchema,
  UpdateStaffSchema,
} from "../schemas/team.schema";

import type {
  CreateStaffInput,
  DeleteStaffInput,
  UpdateStaffInput,
} from "../types/team.types";

export async function createStaffAction(input: CreateStaffInput) {
  const data = CreateStaffSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return teamService.createStaff(data.data);
}

export async function getStaffAction() {
  return teamService.getStaff();
}

export async function updateStaffAction(input: UpdateStaffInput) {
  const data = UpdateStaffSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return teamService.updateStaff(data.data);
}

export async function deleteStaffAction(input: DeleteStaffInput) {
  const data = DeleteStaffSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return teamService.deleteStaff(data.data);
}


