"use client";

import { formatMoney } from "@/src/shared/utils/format-money";
import type { PaymentMethodReport } from "../types/report.types";
import { ReportWidgetCard } from "./report-widget-card";

const methodLabel = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  ACCOUNT: "Cuenta corriente",
};

type PaymentMethodsTableProps = {
  currency?: string | null;
  methods: PaymentMethodReport[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

export function PaymentMethodsTable({
  currency,
  methods,
  isLoading,
  isError,
  errorMessage,
}: PaymentMethodsTableProps) {
  return (
    <ReportWidgetCard
      title="Métodos de pago"
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      isEmpty={methods.length === 0}
      loadingLabel="Cargando métodos de pago..."
      emptyTitle="Todavía no hay pagos registrados"
      emptyDescription="Cuando cobres mesas, acá vas a ver cómo están pagando tus clientes.">
      <div className="divide-y divide-border">
        {methods.map((method) => (
          <div
            key={method.method}
            className="flex items-center justify-between p-4">
            <span className="text-sm">
              {methodLabel[method.method] ?? method.method}
            </span>

            <span className="font-mono text-sm font-medium">
              {formatMoney(method.total, currency)}
            </span>
          </div>
        ))}
      </div>
    </ReportWidgetCard>
  );
}
