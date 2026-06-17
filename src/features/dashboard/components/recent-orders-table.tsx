import type { DashboardRecentOrder } from "../types/dashboard.types";

type RecentOrdersTableProps = {
  orders: DashboardRecentOrder[];
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold text-foreground">
          Últimos pedidos
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay pedidos registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-foreground">Últimos pedidos</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">Mesa</th>
              <th className="py-2 pr-4 font-medium">Estado</th>
              <th className="py-2 pr-4 font-medium">Total</th>
              <th className="py-2 pr-4 font-medium">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-foreground">{order.tableName}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {order.status}
                </td>
                <td className="py-3 pr-4 text-foreground">
                  ${order.total.toFixed(2)}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
