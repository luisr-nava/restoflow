"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/Card";

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
    <Card variant="muted" size="md">
      <CardHeader className="mb-4">
        <CardTitle className="text-sm">QR de {table.name}</CardTitle>
        <CardDescription className="text-xs">
          Código para que el cliente vea el menú y haga pedidos.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center rounded-lg bg-white p-4">
        <QRCodeSVG value={qrUrl} size={180} />
      </CardContent>

      <p className="mt-3 break-all text-xs text-muted-foreground">{qrUrl}</p>
    </Card>
  );
}
