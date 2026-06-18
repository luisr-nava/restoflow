import { z } from "zod";

import { StaffLoginSchema } from "../schemas/staff-auth.schema";
import type { StaffRole } from "./team.types";

export type StaffLoginInput = z.infer<typeof StaffLoginSchema>;

export type StaffSession = {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: StaffRole;
};
