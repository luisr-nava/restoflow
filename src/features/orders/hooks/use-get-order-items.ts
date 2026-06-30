"use client";

import { useQuery } from "@tanstack/react-query";

import type { OrderItemDetail } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

async function fetchOrderItems(orderId: string): Promise<OrderItemDetail[]> {
  const response = await fetch(`/api/orders/${orderId}/items`, {
    method: "GET",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(
      payload?.error ?? "No se pudo cargar el detalle del pedido",
    );
  }

  return (await response.json()) as OrderItemDetail[];
}

export function useGetOrderItems(orderId: string, open: boolean) {
  return useQuery({
    queryKey: orderKeys.items(orderId),
    queryFn: () => fetchOrderItems(orderId),
    enabled: open && !!orderId,
  });
}
