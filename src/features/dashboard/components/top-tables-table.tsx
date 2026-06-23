import type { DashboardTopTable } from "../types/dashboard.types";

type TopTablesTableProps = {
  tables: DashboardTopTable[];
};

export function TopTablesTable({ tables }: TopTablesTableProps) {
  if (tables.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-lg font-semibold text-foreground">
          Mesas con mayor consumo
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Todavía no hay datos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-foreground">
        Mesas con mayor consumo
      </h2>

      <div className="mt-4 overflow-x-auto">
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
                  ${table.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
