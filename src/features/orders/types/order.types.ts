import { z } from "zod";

import {
  CloseTableSchema,
  CreateOrderItemSchema,
  CreateTableOrderSchema,
  UpdateOrderStatusSchema,
} from "../schemas/order.schema";

export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;

export type CreateTableOrderInput = z.infer<typeof CreateTableOrderSchema>;

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELED"
  | "PAID";

export type OrderSource = "WAITER" | "QR";
export type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "ACCOUNT";

export type Order = {
  id: string;
  restaurant_id: string;
  table_id: string;
  created_by: string | null;
  source: OrderSource;
  status: OrderStatus;
  covers: number;
  total: number;
  accepted_at: string | null;
  preparing_at: string | null;
  ready_at: string | null;
  served_at: string | null;
  paid_at: string | null;
};

export type OrderWithTable = Order & {
  restaurant_tables: {
    id: string;
    name: string;
  } | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
};

export type OrderItemDetail = {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
};

export type Payment = {
  id: string;
  restaurant_id: string;
  order_id: string;
  method: PaymentMethod;
  amount: number;
  paid_amount: number | null;
  change_amount: number | null;
  paid_at: string;
  created_at: string;
};

export type CloseTableInput = z.infer<typeof CloseTableSchema>;

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

