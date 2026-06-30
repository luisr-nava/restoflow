import { NextResponse } from "next/server";
import { orderService } from "@/src/features/orders/services/order.service";

type RouteContext = {
  params: Promise<{
    orderId?: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json(
      {
        error: "El pedido es obligatorio",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const items = await orderService.getOrderItems(orderId);

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar el detalle del pedido",
      },
      {
        status: 500,
      },
    );
  }
}
