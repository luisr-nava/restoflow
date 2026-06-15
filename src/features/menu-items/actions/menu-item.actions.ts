"use server";

import {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
} from "../schemas/menu-item.schema";
import { menuItemService } from "../services/menu-item.service";
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "../types/menu-item.types";

export async function createMenuItemAction(input: CreateMenuItemInput) {
  const data = CreateMenuItemSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return menuItemService.createMenuItem(data.data);
}

export async function getMenuItemsAction() {
  return menuItemService.getMenuItems();
}

export async function updateMenuItemAction(input: UpdateMenuItemInput) {
  const data = UpdateMenuItemSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return menuItemService.updateMenuItem(data.data);
}

export async function updateMenuItemAvailabilityAction(
  menuItemId: string,
  isAvailable: boolean,
) {
  return menuItemService.updateAvailability(menuItemId, isAvailable);
}
