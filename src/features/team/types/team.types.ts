import { z } from "zod";

import {
  CreateStaffSchema,
  DeleteStaffSchema,
  UpdateStaffSchema,
} from "../schemas/team.schema";

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;

export type StaffRole = "WAITER" | "KITCHEN";

export type RestaurantStaff = {
  id: string;
  restaurant_id: string;
  name: string;
  email: string | null;
  role: StaffRole;
  pin_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>;

export type DeleteStaffInput = z.infer<typeof DeleteStaffSchema>;

