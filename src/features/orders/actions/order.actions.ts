"use server";

import {
  CloseTableSchema,
  CreateTableOrderSchema,
} from "../schemas/order.schema";
import { orderService } from "../services/order.service";
import type {
  CloseTableInput,
  CreateTableOrderInput,
} from "../types/order.types";

export async function createTableOrderAction(input: CreateTableOrderInput) {
  const data = CreateTableOrderSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.createTableOrder(data.data);
}
export async function getActiveOrderByTableIdAction(tableId: string) {
  if (!tableId) {
    return null;
  }

  return orderService.getActiveOrderByTableId(tableId);
}

export async function closeTableAction(input: CloseTableInput) {
  const data = CloseTableSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.closeTable(data.data);
}
export async function getOrdersAction() {
  return orderService.getOrders();
}

export async function getOrderItemsAction(orderId: string) {
  if (!orderId) {
    return [];
  }

  return orderService.getOrderItems(orderId);

}