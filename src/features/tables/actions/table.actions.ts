"use server";

import {
  CreateTableSchema,
  UpdateTablePositionSchema,
  UpdateTableSchema,
} from "../schemas/table.schema";

import type {
  CreateTableInput,
  UpdateTableInput,
  UpdateTablePositionInput,
} from "../types/table.types";
import { tableService } from "../services/table.service";

export async function createTableAction(input: CreateTableInput) {
  const data = CreateTableSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return tableService.createTable(data.data);
}

export async function updateTablePositionAction(
  input: UpdateTablePositionInput,
) {
  const data = UpdateTablePositionSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return tableService.updateTablePosition(data.data);
}

export async function getTablesByFloorIdAction(floorId: string) {
  return tableService.getTablesByFloorId(floorId);
}

export async function updateTableAction(input: UpdateTableInput) {
  const data = UpdateTableSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return tableService.updateTable(data.data);
}

export async function deleteTableAction(tableId: string) {
  return tableService.deleteTable(tableId);
}

