import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Order,
  OrderItem,
  OrderItemDetail,
  OrderSource,
  OrderWithTable,
  UpdateOrderStatusInput,
} from "../types/order.types";

type CreateOrderParams = {
  restaurantId: string;
  tableId: string;
  waiterId?: string | null;
  source?: OrderSource;
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

  findOrdersByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: OrderWithTable[] | null; error: Error | null }>;

  findOrderItems(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: OrderItemDetail[] | null; error: Error | null }>;

  updateOrderStatus(
    supabase: SupabaseClient,
    input: UpdateOrderStatusInput,
  ): Promise<{ data: Order | null; error: Error | null }>;

  findOpenOrderByTableId(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: Order | null; error: Error | null }>;

  findOpenOrdersByTableId(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: Order[] | null; error: Error | null }>;
  findOpenOrdersByTableIds(
    supabase: SupabaseClient,
    tableIds: string[],
  ): Promise<{ data: Order[] | null; error: Error | null }>;

  markOrdersAsPaid(
    supabase: SupabaseClient,
    orderIds: string[],
  ): Promise<{ error: Error | null }>;
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
        created_by: input.source === "WAITER" ? null : (input.waiterId ?? null),
        source: input.source ?? "WAITER",
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
      .in("status", ["PENDING"])
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
  async findOrdersByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: OrderWithTable[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      restaurant_tables (
        id,
        name
      )
    `,
      )
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    return { data, error };
  }

  async findOrderItems(
    supabase: SupabaseClient,
    orderId: string,
  ): Promise<{ data: OrderItemDetail[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    return { data, error };
  }

  async updateOrderStatus(
    supabase: SupabaseClient,
    input: UpdateOrderStatusInput,
  ): Promise<{ data: Order | null; error: Error | null }> {
    const timestampByStatus = {
      ACCEPTED: "accepted_at",
      PREPARING: "preparing_at",
      READY: "ready_at",
      SERVED: "served_at",
    } as const;

    const { data, error } = await supabase
      .from("orders")
      .update({
        status: input.status,
        [timestampByStatus[input.status]]: new Date().toISOString(),
      })
      .eq("id", input.orderId)
      .select("*")
      .single();

    return { data, error };
  }

  async findOpenOrderByTableId(
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

  async findOpenOrdersByTableId(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: Order[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("table_id", tableId)
      .in("status", ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED"])
      .order("created_at", { ascending: true });

    return { data, error };
  }

  async findOpenOrdersByTableIds(
    supabase: SupabaseClient,
    tableIds: string[],
  ): Promise<{ data: Order[] | null; error: Error | null }> {
    if (tableIds.length === 0) {
      return {
        data: [],
        error: null,
      };
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("table_id", tableIds)
      .in("status", ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED"])
      .order("created_at", { ascending: true });

    return { data, error };
  }

  async markOrdersAsPaid(
    supabase: SupabaseClient,
    orderIds: string[],
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "PAID",
        paid_at: new Date().toISOString(),
      })
      .in("id", orderIds);

    return { error };
  }
}

export const orderRepository = new OrderRepository();




