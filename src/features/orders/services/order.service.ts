import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { menuItemRepository } from "@/src/features/menu-items/repositories/menu-item.repository";
import { tableRepository } from "@/src/features/tables/repositories/table.repository";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import {
  IOrderRepository,
  orderRepository,
} from "../repositories/order.repository";
import type {
  CloseTableInput,
  CreateTableOrderInput,
  Order,
  OrderItemDetail,
  OrderWithTable,
  UpdateOrderStatusInput,
} from "../types/order.types";
import { createPublicClient } from "@/src/lib/supabase/public";
import { getStaffSession } from "../../team/lib/staff-session";
class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  private async getSupabase() {
    return createClient();
  }

  private toError(error: unknown, fallback: string) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(fallback);
  }

  private groupOpenOrdersByTable(orders: Order[]) {
    return orders.reduce<Record<string, Order>>((acc, order) => {
      const currentOrder = acc[order.table_id];

      if (!currentOrder) {
        acc[order.table_id] = {
          ...order,
          total: Number(order.total),
        };
        return acc;
      }

      acc[order.table_id] = {
        ...currentOrder,
        total: Number(currentOrder.total) + Number(order.total),
      };

      return acc;
    }, {});
  }

  private belongsToInactiveCategory(menuItem: {
    category_id: string | null;
    menu_categories: {
      is_active: boolean;
    } | null;
  }) {
    return (
      menuItem.category_id !== null && menuItem.menu_categories?.is_active === false
    );
  }

  async createTableOrder(input: CreateTableOrderInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

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

        if (this.belongsToInactiveCategory(menuItem)) {
          return {
            error: `El item ${menuItem.name} pertenece a una categoría inactiva`,
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
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data: order, error } =
        await this.orderRepository.findActiveOrderByTableId(supabase, tableId);

      if (error) {
        throw new Error(error.message);
      }

      if (!order) {
        return null;
      }

      if (order.restaurant_id !== member.restaurant_id) {
        throw new Error("No tenés permisos para ver este pedido");
      }

      return order;
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el pedido activo");
    }
  }

  async closeTable(input: CloseTableInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      const { data: orders, error: ordersError } =
        await this.orderRepository.findOpenOrdersByTableId(
          supabase,
          input.tableId,
        );

      if (ordersError || !orders || orders.length === 0) {
        return {
          error: ordersError?.message || "La mesa no tiene pedidos abiertos",
          success: "",
        };
      }

      const hasInvalidRestaurant = orders.some(
        (order) => order.restaurant_id !== member.restaurant_id,
      );

      if (hasInvalidRestaurant) {
        return {
          error: "No tenés permisos para cerrar esta mesa",
          success: "",
        };
      }

      const total = orders.reduce((acc, order) => acc + Number(order.total), 0);
      const orderIds = orders.map((order) => order.id);

      const { error: paymentError } = await this.orderRepository.createPayment(
        supabase,
        {
          restaurantId: member.restaurant_id,
          orderId: orderIds[0],
          amount: total,
          method: input.method,
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

      const { error: ordersPaidError } =
        await this.orderRepository.markOrdersAsPaid(supabase, orderIds);

      if (ordersPaidError) {
        return {
          error: ordersPaidError.message,
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
  async getOrders(): Promise<OrderWithTable[]> {
    const supabase = await this.getSupabase();

    const member =
      await restaurantService.getCurrentUserRestaurantMember(supabase);

    if (!member) {
      throw new Error("No se pudo obtener la membresía del restaurante");
    }

    const { data, error } = await this.orderRepository.findOrdersByRestaurantId(
      supabase,
      member.restaurant_id,
    );

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  }

  async getOrderItems(orderId: string): Promise<OrderItemDetail[]> {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data: order, error: orderError } = await this.orderRepository.findOrderById(
        supabase,
        orderId,
      );

      if (orderError) {
        throw new Error(orderError.message);
      }

      if (!order) {
        throw new Error("El pedido no existe");
      }

      if (order.restaurant_id !== member.restaurant_id) {
        throw new Error("No tenés permisos para ver este pedido");
      }

      const { data, error } = await this.orderRepository.findOrderItems(
        supabase,
        orderId,
      );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el detalle del pedido");
    }
  }

  async updateOrderStatus(input: UpdateOrderStatusInput) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        return {
          error: "El usuario no pertenece a un restaurante",
          success: "",
        };
      }

      const { data: order, error: orderError } =
        await this.orderRepository.findOrderById(supabase, input.orderId);

      if (orderError || !order) {
        return {
          error: orderError?.message || "El pedido no existe",
          success: "",
        };
      }

      if (order.restaurant_id !== member.restaurant_id) {
        return {
          error: "No tenés permisos para modificar este pedido",
          success: "",
        };
      }

      const nextStatusByCurrentStatus: Partial<
        Record<OrderWithTable["status"], UpdateOrderStatusInput["status"]>
      > = {
        PENDING: "ACCEPTED",
        ACCEPTED: "PREPARING",
        PREPARING: "READY",
        READY: "SERVED",
      };

      const expectedNextStatus = nextStatusByCurrentStatus[order.status];

      if (!expectedNextStatus || input.status !== expectedNextStatus) {
        return {
          error: "No se puede avanzar el pedido a ese estado",
          success: "",
        };
      }

      const { error } = await this.orderRepository.updateOrderStatus(
        supabase,
        input,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Estado actualizado correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar el estado",
        success: "",
      };
    }
  }
  async createQrTableOrder(input: CreateTableOrderInput) {
    const supabase = createPublicClient();

    try {
      const { data: table, error: tableError } =
        await tableRepository.findTableById(supabase, input.tableId);

      if (tableError || !table) {
        return {
          error: tableError?.message || "La mesa no existe",
          success: "",
        };
      }

      if (table.status === "CLOSED") {
        return {
          error: "No se puede crear un pedido en una mesa cerrada",
          success: "",
        };
      }

      const { data: order, error: orderError } =
        await this.orderRepository.createOrder(supabase, {
          restaurantId: table.restaurant_id,
          tableId: table.id,
          waiterId: null,
          source: "QR",
        });

      if (orderError || !order) {
        return {
          error: orderError?.message || "No se pudo crear el pedido",
          success: "",
        };
      }

      let total = 0;

      for (const item of input.items) {
        const { data: menuItem, error: menuItemError } =
          await menuItemRepository.findMenuItemById(supabase, item.menuItemId);

        if (menuItemError || !menuItem) {
          return {
            error: menuItemError?.message || "Un item del menú no existe",
            success: "",
          };
        }

        if (menuItem.restaurant_id !== table.restaurant_id) {
          return {
            error: "Un item del menú no pertenece al restaurante",
            success: "",
          };
        }

        if (this.belongsToInactiveCategory(menuItem)) {
          return {
            error: `El item ${menuItem.name} pertenece a una categoría inactiva`,
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
        success: "Pedido enviado correctamente",
      };
    } catch {
      return {
        error: "No se pudo enviar el pedido",
        success: "",
      };
    }
  }
  async createStaffTableOrder(input: CreateTableOrderInput) {
    const supabase = createServiceRoleClient();

    try {
      const session = await getStaffSession();

      if (!session) {
        return {
          error: "No hay sesión de personal activa",
          success: "",
        };
      }

      if (session.role !== "WAITER") {
        return {
          error: "Sólo los mozos pueden tomar pedidos",
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

      if (table.restaurant_id !== session.restaurantId) {
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
            restaurantId: session.restaurantId,
            tableId: table.id,
            waiterId: session.id,
            source: "WAITER",
          });

        if (orderError || !createdOrder) {
          return {
            error: `createOrder: ${orderError?.message || "No se pudo crear el pedido"}`,
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

        if (menuItem.restaurant_id !== session.restaurantId) {
          return {
            error: "Un item del menú no pertenece al restaurante",
            success: "",
          };
        }

        if (this.belongsToInactiveCategory(menuItem)) {
          return {
            error: `El item ${menuItem.name} pertenece a una categoría inactiva`,
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
            error: `createOrderItem: ${orderItemError.message}`,
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
          error: `updateOrderTotal: ${totalError.message}`,
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
            error: `updateTableStatus: ${tableStatusError.message}`,
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
  async getOpenOrderByTableId(tableId: string) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data: orders, error } =
        await this.orderRepository.findOpenOrdersByTableId(supabase, tableId);

      if (error) {
        throw new Error(error.message);
      }

      if (!orders || orders.length === 0) {
        return null;
      }

      const validOrders = orders.filter(
        (order) => order.restaurant_id === member.restaurant_id,
      );

      if (validOrders.length === 0) {
        throw new Error("No tenés permisos para ver los pedidos de esta mesa");
      }

      const total = validOrders.reduce(
        (acc, order) => acc + Number(order.total),
        0,
      );

      return {
        ...validOrders[0],
        total,
      };
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el pedido abierto");
    }
  }
  async getOpenOrdersByTableIds(tableIds: string[]) {
    const supabase = await this.getSupabase();

    try {
      const member =
        await restaurantService.getCurrentUserRestaurantMember(supabase);

      if (!member) {
        throw new Error("No se pudo obtener la membresía del restaurante");
      }

      const { data: orders, error } =
        await this.orderRepository.findOpenOrdersByTableIds(supabase, tableIds);

      if (error) {
        throw new Error(error.message);
      }

      const validOrders = (orders ?? []).filter(
        (order) => order.restaurant_id === member.restaurant_id,
      );

      return this.groupOpenOrdersByTable(validOrders);
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar los pedidos abiertos");
    }
  }
  async closeStaffTable(input: CloseTableInput) {
    const supabase = createServiceRoleClient();
    try {
      const session = await getStaffSession();

      if (!session) {
        return {
          error: "No hay sesión de personal activa",
          success: "",
        };
      }

      if (session.role !== "WAITER") {
        return {
          error: "Sólo los mozos pueden cerrar mesas",
          success: "",
        };
      }

      const { data: orders, error: ordersError } =
        await this.orderRepository.findOpenOrdersByTableId(
          supabase,
          input.tableId,
        );

      if (ordersError || !orders || orders.length === 0) {
        return {
          error: ordersError?.message || "La mesa no tiene pedidos abiertos",
          success: "",
        };
      }

      const hasInvalidRestaurant = orders.some(
        (order) => order.restaurant_id !== session.restaurantId,
      );

      if (hasInvalidRestaurant) {
        return {
          error: "No tenés permisos para cerrar esta mesa",
          success: "",
        };
      }

      const total = orders.reduce((acc, order) => acc + Number(order.total), 0);
      const orderIds = orders.map((order) => order.id);

      const { error: paymentError } = await this.orderRepository.createPayment(
        supabase,
        {
          restaurantId: session.restaurantId,
          orderId: orderIds[0],
          amount: total,
          method: input.method,
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

      const { error: ordersPaidError } =
        await this.orderRepository.markOrdersAsPaid(supabase, orderIds);

      if (ordersPaidError) {
        return {
          error: ordersPaidError.message,
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

  async getStaffOpenOrderByTableId(tableId: string) {
    const supabase = createServiceRoleClient();
    try {
      const session = await getStaffSession();

      if (!session) {
        throw new Error("No hay sesión de personal activa");
      }

      if (session.role !== "WAITER") {
        throw new Error("Sólo los mozos pueden ver pedidos de mesas");
      }

      const { data: orders, error } =
        await this.orderRepository.findOpenOrdersByTableId(supabase, tableId);

      if (error) {
        throw new Error(error.message);
      }

      if (!orders || orders.length === 0) {
        return null;
      }

      const validOrders = orders.filter(
        (order) => order.restaurant_id === session.restaurantId,
      );

      if (validOrders.length === 0) {
        throw new Error("No tenés permisos para ver los pedidos de esta mesa");
      }

      const total = validOrders.reduce(
        (acc, order) => acc + Number(order.total),
        0,
      );

      return {
        ...validOrders[0],
        total,
      };
    } catch (error) {
      throw this.toError(error, "No se pudo cargar el pedido abierto");
    }
  }
  async getStaffOpenOrdersByTableIds(tableIds: string[]) {
    const supabase = createServiceRoleClient();

    try {
      const session = await getStaffSession();

      if (!session) {
        throw new Error("No hay sesión de personal activa");
      }

      if (session.role !== "WAITER") {
        throw new Error("Sólo los mozos pueden ver pedidos de mesas");
      }

      const { data: orders, error } =
        await this.orderRepository.findOpenOrdersByTableIds(supabase, tableIds);

      if (error) {
        throw new Error(error.message);
      }

      const validOrders = (orders ?? []).filter(
        (order) => order.restaurant_id === session.restaurantId,
      );

      return this.groupOpenOrdersByTable(validOrders);
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar los pedidos abiertos");
    }
  }

  async getOrdersByStaffSession(): Promise<OrderWithTable[]> {
    const supabase = createServiceRoleClient();
    try {
      const session = await getStaffSession();

      if (!session) {
        throw new Error("No hay sesión de personal activa");
      }

      if (session.role !== "KITCHEN") {
        throw new Error("Sólo cocina puede ver los pedidos");
      }

      const { data, error } =
        await this.orderRepository.findOrdersByRestaurantId(
          supabase,
          session.restaurantId,
        );

      if (error) {
        throw new Error(error.message);
      }

      return data ?? [];
    } catch (error) {
      throw this.toError(error, "No se pudieron cargar los pedidos");
    }
  }

  async updateStaffOrderStatus(input: UpdateOrderStatusInput) {
    const supabase = createServiceRoleClient();
    try {
      const session = await getStaffSession();

      if (!session) {
        return {
          error: "No hay sesión de personal activa",
          success: "",
        };
      }

      if (session.role !== "KITCHEN") {
        return {
          error: "Sólo cocina puede actualizar pedidos",
          success: "",
        };
      }

      const { data: order, error: orderError } =
        await this.orderRepository.findOrderById(supabase, input.orderId);

      if (orderError || !order) {
        return {
          error: orderError?.message || "El pedido no existe",
          success: "",
        };
      }

      if (order.restaurant_id !== session.restaurantId) {
        return {
          error: "No tenés permisos para modificar este pedido",
          success: "",
        };
      }

      const nextStatusByCurrentStatus: Partial<
        Record<OrderWithTable["status"], UpdateOrderStatusInput["status"]>
      > = {
        PENDING: "ACCEPTED",
        ACCEPTED: "PREPARING",
        PREPARING: "READY",
      };

      const expectedNextStatus = nextStatusByCurrentStatus[order.status];

      if (!expectedNextStatus || input.status !== expectedNextStatus) {
        return {
          error: "No se puede avanzar el pedido a ese estado",
          success: "",
        };
      }

      const { error } = await this.orderRepository.updateOrderStatus(
        supabase,
        input,
      );

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Estado actualizado correctamente",
      };
    } catch {
      return {
        error: "No se pudo actualizar el estado",
        success: "",
      };
    }
  }
}

export const orderService = new OrderService(orderRepository);
