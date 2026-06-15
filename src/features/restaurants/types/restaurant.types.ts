import { z } from "zod";

import { CreateRestaurantSchema } from "../schemas/restaurant.schema";

export type CreateRestaurantInput = z.infer<typeof CreateRestaurantSchema>;

export type RestaurantRole = "OWNER" | "MANAGER" | "WAITER" | "KITCHEN";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  email: string | null;
  tax_id: string | null;
  currency: string;
  timezone: string;
  logo_url: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type RestaurantMember = {
  id: string;
  restaurant_id: string;
  user_id: string;
  role: RestaurantRole;
  created_at: string;
};
