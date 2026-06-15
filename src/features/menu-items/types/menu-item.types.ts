import { z } from "zod";

import {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
} from "../schemas/menu-item.schema";

export type CreateMenuItemInput = z.infer<typeof CreateMenuItemSchema>;

export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;

export type MenuItem = {
  id: string;
  restaurant_id: string;

  name: string;
  description: string | null;

  price: number;
  category_id: string | null;

  image_url: string | null;

  is_available: boolean;

  created_at: string;
  updated_at: string;
};

