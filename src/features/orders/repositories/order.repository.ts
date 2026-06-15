import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateTableOrderInput,
  Order,
  OrderItem,
} from "../types/order.types";

type CreateOrderParams = {
  restaurantId: string;
  tableId: string;
  waiterId?: string;
  notes?: string;
};

type CreateOrderItemParams = {
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
};
type CreatePaymentParams = {
  restaurantId: string;
  orderId: string;
  method: "CASH" | "CARD" | "TRANSFER" | "ACCOUNT";
  amount: number;
  paidAmount?: number;
  changeAmount?: number;
};

export interface IOrderRepository {
  createOrder(
    supabase: SupabaseClient,
    input: CreateOrderParams,
  ): Promise<{ data: Order | null; error: Error | null }>;

  createOrderItem(
    supabase: SupabaseClient,
    input: CreateOrderItemParams,
  ): Promise<{ data: OrderItem | null; error: Error | null }>;

  updateOrderTotal(
    supabase: SupabaseClient,
    orderId: string,
    total: number,
  ): Promise<{ data: Order | null; error: Error | null }>;

  findOrderById(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: Order | null; error: Error | null }>;

  findActiveOrderByTableId(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: Order | null; error: Error | null }>;
  createPayment(
    supabase: SupabaseClient,
    input: CreatePaymentParams,
  ): Promise<{ data: unknown; error: Error | null }>;

  markOrderAsPaid(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: Order | null; error: Error | null }>;
}

class OrderRepository implements IOrderRepository {
  async createOrder(
    supabase: SupabaseClient,
    input: CreateOrderParams,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        restaurant_id: input.restaurantId,
        table_id: input.tableId,
        created_by: input.waiterId || null,
        source: "WAITER",
        status: "PENDING",
        covers: 1,
        total: 0,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async createOrderItem(
    supabase: SupabaseClient,
    input: CreateOrderItemParams,
  ): Promise<{ data: OrderItem | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("order_items")
      .insert({
        order_id: input.orderId,
        menu_item_id: input.menuItemId,
        name: input.name,
        quantity: input.quantity,
        unit_price: input.unitPrice,
        total: input.total,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async updateOrderTotal(
    supabase: SupabaseClient,
    orderId: string,
    total: number,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .update({
        total,
      })
      .eq("id", orderId)
      .select("*")
      .single();

    return { data, error };
  }

  async findOrderById(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    return { data, error };
  }

  async findActiveOrderByTableId(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("table_id", tableId)
      .in("status", ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  }

  async createPayment(
    supabase: SupabaseClient,
    input: CreatePaymentParams,
  ): Promise<{ data: unknown; error: Error | null }> {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        restaurant_id: input.restaurantId,
        order_id: input.orderId,
        method: input.method,
        amount: input.amount,
        paid_amount: input.paidAmount ?? null,
        change_amount: input.changeAmount ?? null,
        paid_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    return { data, error };
  }

  async markOrderAsPaid(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "PAID",
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select("*")
      .single();

    return { data, error };
  }
}

export const orderRepository = new OrderRepository();

