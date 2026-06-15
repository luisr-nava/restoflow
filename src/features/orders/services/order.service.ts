import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { menuItemRepository } from "@/src/features/menu-items/repositories/menu-item.repository";
import { tableRepository } from "@/src/features/tables/repositories/table.repository";
import { createClient } from "@/src/lib/supabase/server";

import {
  IOrderRepository,
  orderRepository,
} from "../repositories/order.repository";
import type {
  CloseTableInput,
  CreateTableOrderInput,
} from "../types/order.types";
class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async createTableOrder(input: CreateTableOrderInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      const { data: table, error: tableError } =
        await tableRepository.findTableById(supabase, input.tableId);

      if (tableError || !table) {
        return {
          error: tableError?.message || "La mesa no existe",
          success: "",
        };
      }

      if (table.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para usar esta mesa",
          success: "",
        };
      }

      if (table.status === "CLOSED") {
        return {
          error: "No se puede crear un pedido en una mesa cerrada",
          success: "",
        };
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          error: "No se pudo obtener el usuario autenticado",
          success: "",
        };
      }

      const { data: activeOrder, error: activeOrderError } =
        await this.orderRepository.findActiveOrderByTableId(supabase, table.id);

      if (activeOrderError) {
        return {
          error: activeOrderError.message,
          success: "",
        };
      }

      let order = activeOrder;
      let total = activeOrder ? Number(activeOrder.total) : 0;

      if (!order) {
        const { data: createdOrder, error: orderError } =
          await this.orderRepository.createOrder(supabase, {
            restaurantId: member.restaurant_id,
            tableId: table.id,
            waiterId: user.id,
          });

        if (orderError || !createdOrder) {
          return {
            error: orderError?.message || "No se pudo crear el pedido",
            success: "",
          };
        }

        order = createdOrder;
      }

      for (const item of input.items) {
        const { data: menuItem, error: menuItemError } =
          await menuItemRepository.findMenuItemById(supabase, item.menuItemId);

        if (menuItemError || !menuItem) {
          return {
            error: menuItemError?.message || "Un item del menú no existe",
            success: "",
          };
        }

        if (menuItem.restaurant_id !== member.restaurant_id) {
          return {
            error: "Un item del menú no pertenece al restaurante",
            success: "",
          };
        }

        if (!menuItem.is_available) {
          return {
            error: `El item ${menuItem.name} no está disponible`,
            success: "",
          };
        }

        const itemTotal = Number(menuItem.price) * item.quantity;
        total += itemTotal;

        const { error: orderItemError } =
          await this.orderRepository.createOrderItem(supabase, {
            orderId: order.id,
            menuItemId: menuItem.id,
            name: menuItem.name,
            quantity: item.quantity,
            unitPrice: Number(menuItem.price),
            total: itemTotal,
          });

        if (orderItemError) {
          return {
            error: orderItemError.message,
            success: "",
          };
        }
      }

      const { error: totalError } = await this.orderRepository.updateOrderTotal(
        supabase,
        order.id,
        total,
      );

      if (totalError) {
        return {
          error: totalError.message,
          success: "",
        };
      }

      if (table.status === "AVAILABLE" || table.status === "RESERVED") {
        const { error: tableStatusError } =
          await tableRepository.updateTableStatus(
            supabase,
            table.id,
            "OCCUPIED",
          );

        if (tableStatusError) {
          return {
            error: tableStatusError.message,
            success: "",
          };
        }
      }

      return {
        error: "",
        success: activeOrder
          ? "Pedido actualizado correctamente"
          : "Pedido creado correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear el pedido",
        success: "",
      };
    }
  }
  async getActiveOrderByTableId(tableId: string) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return null;
      }

      const { data: order, error } =
        await this.orderRepository.findActiveOrderByTableId(supabase, tableId);

      if (error || !order) {
        return null;
      }

      if (order.restaurant_id !== member.restaurant_id) {
        return null;
      }

      return order;
    } catch {
      return null;
    }
  }

  async closeTable(input: CloseTableInput) {
    const supabase = await this.getSupabase();

    try {
      const member = await restaurantService.getCurrentUserRestaurantMember();

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      const { data: order, error: orderError } =
        await this.orderRepository.findActiveOrderByTableId(
          supabase,
          input.tableId,
        );

      if (orderError || !order) {
        return {
          error: orderError?.message || "La mesa no tiene un pedido activo",
          success: "",
        };
      }

      if (order.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para cerrar esta mesa",
          success: "",
        };
      }

      const { error: paymentError } = await this.orderRepository.createPayment(
        supabase,
        {
          restaurantId: member.restaurant_id,
          orderId: order.id,
          method: input.method,
          amount: Number(order.total),
          paidAmount: input.paidAmount,
          changeAmount: input.changeAmount,
        },
      );

      if (paymentError) {
        return {
          error: paymentError.message,
          success: "",
        };
      }

      const { error: orderPaidError } =
        await this.orderRepository.markOrderAsPaid(supabase, order.id);

      if (orderPaidError) {
        return {
          error: orderPaidError.message,
          success: "",
        };
      }

      const { error: tableStatusError } =
        await tableRepository.updateTableStatus(
          supabase,
          input.tableId,
          "AVAILABLE",
        );

      if (tableStatusError) {
        return {
          error: tableStatusError.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Mesa cerrada correctamente",
      };
    } catch {
      return {
        error: "No se pudo cerrar la mesa",
        success: "",
      };
    }
  }
}

export const orderService = new OrderService(orderRepository);




