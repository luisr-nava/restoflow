"use client";

import { pdf } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import { Button } from "@/src/shared/components/ui/Button";

import type { TableQrPdfItem } from "../types/table-qr.types";
import { TableQrPdfDocument } from "./table-qr-pdf-document";

type ExportTableQrPdfButtonProps = {
  items: TableQrPdfItem[];
};

export function ExportTableQrPdfButton({ items }: ExportTableQrPdfButtonProps) {
  async function handleExport() {
    if (items.length === 0) {
      toast.error("No hay QRs para exportar");
      return;
    }

    const blob = await pdf(<TableQrPdfDocument items={items} />).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "restoflow-qr-mesas.pdf";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={handleExport}
      className="py-2.5 hover:opacity-90">
      Exportar PDF
    </Button>
  );
}
