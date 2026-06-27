export const orderKeys = {
  all: ["orders"] as const,
  staffAll: ["staff-orders"] as const,
  activeRoot: ["orders", "active"] as const,
  active: (tableId: string) => ["orders", "active", tableId] as const,
  openRoot: ["open-order"] as const,
  open: (tableId: string) => ["open-order", tableId] as const,
  openMany: (tableIds: string[]) =>
    ["open-order", "many", ...tableIds] as const,
  staffOpenRoot: ["staff-open-order"] as const,
  staffOpen: (tableId: string) => ["staff-open-order", tableId] as const,
  staffOpenMany: (tableIds: string[]) =>
    ["staff-open-order", "many", ...tableIds] as const,
  itemsRoot: ["order-items"] as const,
  items: (orderId: string) => ["order-items", orderId] as const,
};
