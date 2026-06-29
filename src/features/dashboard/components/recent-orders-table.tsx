import { formatMoney } from "@/src/shared/utils/format-money";
import { Card, CardContent, CardTitle } from "@/src/shared/components/ui/Card";
import type { DashboardRecentOrder } from "../types/dashboard.types";

type RecentOrdersTableProps = {
  orders: DashboardRecentOrder[];
  currency?: string | null;
};

const statusLabelByStatus: Record<string, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptado",
  PREPARING: "Preparando",
  READY: "Listo",
  SERVED: "Servido",
  CANCELED: "Cancelado",
  PAID: "Pagado",
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function RecentOrdersTable({
  orders,
  currency,
}: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Card variant="muted" size="md">
        <CardTitle className="text-lg">Últimos pedidos</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay pedidos registrados.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="muted" size="md">
      <CardTitle className="text-lg">Últimos pedidos</CardTitle>

      <CardContent className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Últimos pedidos registrados con mesa, estado, total y fecha.
          </caption>
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">
                Mesa
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Estado
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Total
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Fecha
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-foreground">{order.tableName}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {statusLabelByStatus[order.status] ?? order.status}
                </td>
                <td className="py-3 pr-4 text-foreground">
                  {formatMoney(order.total, currency)}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
