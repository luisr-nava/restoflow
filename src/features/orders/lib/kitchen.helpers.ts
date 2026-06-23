import type { OrderSource, OrderStatus } from "../types/order.types";

export type KitchenOrderAgeLevel = "normal" | "warning" | "critical";

export const statusLabelByStatus: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptado",
  PREPARING: "Preparando",
  READY: "Listo",
  SERVED: "Servido",
  CANCELED: "Cancelado",
  PAID: "Pagado",
};

export const sourceLabelBySource: Record<OrderSource, string> = {
  QR: "QR",
  WAITER: "Mozo",
};

export const ageCardClassNameByLevel: Record<KitchenOrderAgeLevel, string> = {
  normal: "border-border bg-background",
  warning: "border-amber-200 bg-amber-50/40",
  critical: "border-red-300 bg-red-50/50",
};

export function getElapsedMinutes(createdAt: string): string {
  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return "Ahora";
  }

  const elapsedMs = Date.now() - createdAtTimestamp;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  if (elapsedMinutes < 1) {
    return "Ahora";
  }

  if (elapsedMinutes === 1) {
    return "Hace 1 min";
  }

  if (elapsedMinutes < 60) {
    return `Hace ${elapsedMinutes} min`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return `Hace ${elapsedHours} h`;
}

export function getKitchenOrderAgeLevel(
  createdAt: string,
): KitchenOrderAgeLevel {
  const createdAtTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtTimestamp)) {
    return "normal";
  }

  const elapsedMinutes = Math.floor((Date.now() - createdAtTimestamp) / 60000);

  if (elapsedMinutes >= 20) {
    return "critical";
  }

  if (elapsedMinutes >= 10) {
    return "warning";
  }

  return "normal";
}
