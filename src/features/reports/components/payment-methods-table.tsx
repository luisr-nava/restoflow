"use client";

import { usePaymentMethods } from "../hooks/use-payment-methods";
import { ReportWidgetCard } from "./report-widget-card";

const methodLabel = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  ACCOUNT: "Cuenta corriente",
};

export function PaymentMethodsTable() {
  const { data: methods = [], isLoading } = usePaymentMethods();

  return (
    <ReportWidgetCard
      title="Métodos de pago"
      isLoading={isLoading}
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
              ${method.total}
            </span>
          </div>
        ))}
      </div>
    </ReportWidgetCard>
  );
}
