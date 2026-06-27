"use server";

import { orderService } from "../services/order.service";
import {
  CloseTableSchema,
  CreateTableOrderSchema,
  UpdateOrderStatusSchema,
} from "../schemas/order.schema";

import type {
  CloseTableInput,
  CreateTableOrderInput,
  UpdateOrderStatusInput,
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

export async function updateOrderStatusAction(input: UpdateOrderStatusInput) {
  const data = UpdateOrderStatusSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.updateOrderStatus(data.data);
}

export async function createQrTableOrderAction(input: CreateTableOrderInput) {
  const data = CreateTableOrderSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.createQrTableOrder(data.data);
}

export async function createStaffTableOrderAction(
  input: CreateTableOrderInput,
) {
  const data = CreateTableOrderSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.createStaffTableOrder(data.data);
}

export async function getOpenOrderByTableIdAction(tableId: string) {
  if (!tableId) {
    return null;
  }

  return orderService.getOpenOrderByTableId(tableId);
}
export async function getOpenOrdersByTableIdsAction(tableIds: string[]) {
  if (tableIds.length === 0) {
    return {};
  }

  return orderService.getOpenOrdersByTableIds(tableIds);
}

export async function closeStaffTableAction(input: CloseTableInput) {
  const data = CloseTableSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.closeStaffTable(data.data);
}
export async function getStaffOpenOrderByTableIdAction(tableId: string) {
  if (!tableId) {
    return null;
  }

  return orderService.getStaffOpenOrderByTableId(tableId);
}
export async function getStaffOpenOrdersByTableIdsAction(tableIds: string[]) {
  if (tableIds.length === 0) {
    return {};
  }

  return orderService.getStaffOpenOrdersByTableIds(tableIds);
}
export async function getStaffOrdersAction() {
  return orderService.getOrdersByStaffSession();
}

export async function updateStaffOrderStatusAction(
  input: UpdateOrderStatusInput,
) {
  const data = UpdateOrderStatusSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Datos inválidos",
      success: "",
    };
  }

  return orderService.updateStaffOrderStatus(data.data);
}
