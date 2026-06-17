import { z } from "zod";

import {
  CreateTableSchema,
  UpdateTablePositionSchema,
  UpdateTableSchema,
} from "../schemas/table.schema";

export type CreateTableInput = z.infer<typeof CreateTableSchema>;

export type UpdateTablePositionInput = z.infer<
  typeof UpdateTablePositionSchema
>;
export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLOSED";

export type RestaurantTable = {
  id: string;
  restaurant_id: string;
  floor_id: string;
  waiter_id: string | null;
  name: string;
  seats: number;
  status: TableStatus;
  x: number;
  y: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
  qr_token: string;
};

export type UpdateTableInput = z.infer<typeof UpdateTableSchema>;

