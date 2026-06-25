import type { MenuItemWithCategory } from "@/src/features/menu-items/types/menu-item.types";
import type { Restaurant } from "@/src/features/restaurants/types/restaurant.types";
import type { RestaurantStaff } from "@/src/features/team/types/team.types";
import type { RestaurantTable } from "@/src/features/tables/types/table.types";

export type CustomerQrData = {
  table: RestaurantTable;
  restaurant: Restaurant;
  waiter: RestaurantStaff | null;
  menuItems: MenuItemWithCategory[];
};
