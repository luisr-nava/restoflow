"use client";

import { QRCodeSVG } from "qrcode.react";

import type { RestaurantTable } from "../types/table.types";

type TableQrCardProps = {
  table: RestaurantTable;
};

export function TableQrCard({ table }: TableQrCardProps) {
  const qrUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/qr/${table.qr_token}`;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          QR de {table.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Código para que el cliente vea el menú y haga pedidos.
        </p>
      </div>

      <div className="flex justify-center rounded-lg bg-white p-4">
        <QRCodeSVG value={qrUrl} size={180} />
      </div>

      <p className="mt-3 break-all text-xs text-muted-foreground">{qrUrl}</p>
    </div>
  );
}
