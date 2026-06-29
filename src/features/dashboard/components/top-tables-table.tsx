import { formatMoney } from "@/src/shared/utils/format-money";
import { Card, CardContent, CardTitle } from "@/src/shared/components/ui/Card";
import type { DashboardTopTable } from "../types/dashboard.types";

type TopTablesTableProps = {
  tables: DashboardTopTable[];
  currency?: string | null;
};

export function TopTablesTable({ tables, currency }: TopTablesTableProps) {
  if (tables.length === 0) {
    return (
      <Card variant="muted" size="md">
        <CardTitle className="text-lg">Mesas con mayor consumo</CardTitle>

        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay datos para mostrar.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="muted" size="md">
      <CardTitle className="text-lg">Mesas con mayor consumo</CardTitle>

      <CardContent className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Mesas con mayor consumo y su total acumulado.
          </caption>
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">
                Mesa
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {tables.map((table) => (
              <tr
                key={table.tableId}
                className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-foreground">{table.tableName}</td>

                <td className="py-3 pr-4 text-foreground">
                  {formatMoney(table.total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
