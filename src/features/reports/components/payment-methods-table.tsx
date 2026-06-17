"use client";

import { usePaymentMethods } from "../hooks/use-payment-methods";

const methodLabel = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  ACCOUNT: "Cuenta corriente",
};

export function PaymentMethodsTable() {
  const { data: methods = [], isLoading } = usePaymentMethods();

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Métodos de pago</h2>
      </div>

      {isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Cargando...</div>
      ) : methods.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">
          No hay pagos registrados.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {methods.map((method) => (
            <div
              key={method.method}
              className="flex items-center justify-between p-4">
              <span className="text-sm">{methodLabel[method.method]}</span>

              <span className="font-mono text-sm font-medium">
                ${method.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
