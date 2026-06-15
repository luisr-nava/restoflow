"use server";

import {
  CreateMenuCategorySchema,
  UpdateMenuCategorySchema,
} from "../schemas/menu-category.schema";
import { menuCategoryService } from "../services/menu-category.service";
import type {
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
} from "../types/menu-category.types";

export async function createMenuCategoryAction(input: CreateMenuCategoryInput) {
  const data = CreateMenuCategorySchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return menuCategoryService.createCategory(data.data);
}

export async function getMenuCategoriesAction() {
  return menuCategoryService.getCategories();
}

export async function updateMenuCategoryAction(input: UpdateMenuCategoryInput) {
  const data = UpdateMenuCategorySchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return menuCategoryService.updateCategory(data.data);
}

export async function updateMenuCategoryStatusAction(
  categoryId: string,
  isActive: boolean,
) {
  return menuCategoryService.updateCategoryStatus(categoryId, isActive);
}

export async function deleteMenuCategoryAction(categoryId: string) {
  return menuCategoryService.deleteCategory(categoryId);
}

