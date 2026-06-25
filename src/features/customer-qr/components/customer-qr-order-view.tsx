"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { dashboardKeys } from "@/src/features/dashboard/query-keys/dashboard.keys";
import { createQrTableOrderAction } from "@/src/features/orders/actions/order.actions";
import { orderKeys } from "@/src/features/orders/query-keys/order.keys";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { EmptyState } from "@/src/shared/components/states";
import { formatMoney } from "@/src/shared/utils/format-money";

import type { CustomerQrData } from "../types/customer-qr.types";

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type CustomerQrOrderViewProps = {
  data: CustomerQrData;
};

export function CustomerQrOrderView({ data }: CustomerQrOrderViewProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const currency = data.restaurant.currency;
  const total = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );

  function handleAddItem(menuItemId: string, name: string, price: number) {
    setCartItems((current) => {
      const existingItem = current.find(
        (item) => item.menuItemId === menuItemId,
      );

      if (existingItem) {
        return current.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          menuItemId,
          name,
          price,
          quantity: 1,
        },
      ];
    });
  }

  function handleRemoveItem(menuItemId: string) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function handleSubmitOrder() {
    if (cartItems.length === 0) {
      toast.error("Agregá al menos un producto");
      return;
    }

    setIsSubmitting(true);

    const response = await createQrTableOrderAction({
      tableId: data.table.id,
      items: cartItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
      notes: "",
    });

    setIsSubmitting(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: tableKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      }),
    ]);

    toast.success(response.success);
    setCartItems([]);
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-text">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-text-3">{data.restaurant.name}</p>

          <h1 className="mt-1 text-3xl font-semibold text-text">
            Mesa {data.table.name}
          </h1>

          {data.waiter && (
            <p className="mt-2 text-sm text-text-2">
              Te atiende: {data.waiter.name}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Menú disponible</h2>

          {data.menuItems.length === 0 ? (
            <EmptyState
              title="Por ahora no hay productos disponibles"
              description="Probá de nuevo en unos minutos o consultá al personal."
              className="bg-surface"
            />
          ) : (
            <div className="grid gap-3">
              {data.menuItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-text">{item.name}</p>

                      {item.description && (
                        <p className="mt-1 text-sm text-text-2">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-text-3">
                        {item.menu_categories?.name ?? "Sin categoría"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-text">
                        {formatMoney(item.price, currency)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddItem(item.id, item.name, Number(item.price))
                        }
                        className="mt-3 rounded-lg bg-text px-3 py-2 text-xs font-medium text-bg">
                        Agregar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-4 rounded-2xl border border-border bg-surface p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-3">Total</p>
              <p className="text-xl font-semibold text-text">
                {formatMoney(total, currency)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className="rounded-lg bg-text px-4 py-3 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? "Enviando..." : "Enviar pedido"}
            </button>
          </div>

          {cartItems.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              {cartItems.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-text">{item.name}</p>
                    <p className="text-xs text-text-3">
                      {item.quantity} x {formatMoney(item.price, currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.menuItemId)}
                      className="grid size-8 place-items-center rounded-lg border border-border">
                      -
                    </button>

                    <span className="w-6 text-center">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddItem(item.menuItemId, item.name, item.price)
                      }
                      className="grid size-8 place-items-center rounded-lg border border-border">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
