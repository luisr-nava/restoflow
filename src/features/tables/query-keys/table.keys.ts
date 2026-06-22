export const tableKeys = {
  all: ["tables"] as const,
  byFloor: (floorId: string | null) => ["tables", floorId] as const,
  staffAll: ["staff-tables"] as const,
  restaurantAll: ["restaurant-tables"] as const,
};
