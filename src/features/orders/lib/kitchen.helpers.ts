import type { OrderSource, OrderStatus } from "../types/order.types";
import type { UpdateOrderStatusInput } from "../types/order.types";

export type KitchenOrderAgeLevel = "normal" | "warning" | "critical";
export type KitchenColumn = {
  title: string;
  description: string;
  statuses: OrderStatus[];
};

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

export const kitchenColumns: KitchenColumn[] = [
  {
    title: "Pendientes",
    description: "Pedidos por aceptar o iniciar",
    statuses: ["PENDING", "ACCEPTED"],
  },
  {
    title: "En preparación",
    description: "Pedidos que cocina está preparando",
    statuses: ["PREPARING"],
  },
  {
    title: "Listos",
    description: "Pedidos listos para entregar",
    statuses: ["READY"],
  },
];

export const kitchenNextStatusByStatus: Partial<
  Record<OrderStatus, UpdateOrderStatusInput["status"]>
> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
};

export const kitchenActionLabelByStatus: Partial<Record<OrderStatus, string>> = {
  PENDING: "Aceptar",
  ACCEPTED: "Preparar",
  PREPARING: "Marcar listo",
};

export const kitchenStatusClassNameByStatus: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 text-amber-700",
  ACCEPTED: "border-sky-200 text-sky-700",
  PREPARING: "border-orange-200 text-orange-700",
  READY: "border-emerald-200 text-emerald-700",
  SERVED: "border-green-200 text-green-700",
  CANCELED: "border-red-200 text-red-700",
  PAID: "border-zinc-200 text-zinc-700",
};

export function isKitchenActiveStatus(status: OrderStatus) {
  return ["PENDING", "ACCEPTED", "PREPARING", "READY"].includes(status);
}

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
