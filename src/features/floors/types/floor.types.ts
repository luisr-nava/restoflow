import { z } from "zod";

import { CreateFloorSchema, DeleteFloorSchema } from "../schemas/floor.schema";

export type CreateFloorInput = z.infer<typeof CreateFloorSchema>;

export type RestaurantFloor = {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DeleteFloorInput = z.infer<typeof DeleteFloorSchema>;