import { z } from "zod";

import {
  CreateMenuCategorySchema,
  UpdateMenuCategorySchema,
} from "../schemas/menu-category.schema";

export type CreateMenuCategoryInput = z.infer<typeof CreateMenuCategorySchema>;

export type UpdateMenuCategoryInput = z.infer<typeof UpdateMenuCategorySchema>;

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
