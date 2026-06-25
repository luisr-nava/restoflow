"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useCloseStaffTable } from "../hooks/use-close-staff-table";
import { useCloseTable } from "../hooks/use-close-table";
import { CloseTableSchema } from "../schemas/order.schema";
import type { CloseTableInput } from "../types/order.types";

type CloseTableFormProps = {
  tableId: string;
  total: number;
  currency?: string | null;
  onSuccess?: () => void;
  mode?: "admin" | "staff";
};

export function CloseTableForm({
  tableId,
  total,
  currency,
  onSuccess,
  mode = "admin",
}: CloseTableFormProps) {
  const form = useForm<CloseTableInput>({
    resolver: zodResolver(CloseTableSchema) as Resolver<CloseTableInput>,
    defaultValues: {
      tableId,
      method: "CASH",
      paidAmount: undefined,
      changeAmount: undefined,
    },
  });

  const adminCloseTable = useCloseTable();
  const staffCloseTable = useCloseStaffTable();

  const mutate =
    mode === "staff" ? staffCloseTable.mutate : adminCloseTable.mutate;

  const isPending =
    mode === "staff" ? staffCloseTable.isPending : adminCloseTable.isPending;

  const paidAmount = useWatch({
    control: form.control,
    name: "paidAmount",
  });

  useEffect(() => {
    if (!paidAmount || paidAmount < total) {
      form.setValue("changeAmount", undefined);
      return;
    }

    form.setValue("changeAmount", paidAmount - total);
  }, [form, paidAmount, total]);

  const onSubmit = (input: CloseTableInput) => {
    mutate(input, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormSelect name="method" label="Método de pago">
        <option value="CASH">Efectivo</option>
        <option value="CARD">Tarjeta</option>
        <option value="TRANSFER">Transferencia</option>
        <option value="ACCOUNT">Cuenta corriente</option>
      </FormSelect>

      <div className="rounded-xl border border-border p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Total a cobrar
        </p>
        <p className="mt-1 text-lg font-medium">
          {formatMoney(total, currency)}
        </p>
      </div>

      <FormInput
        name="paidAmount"
        label="Paga con"
        type="number"
        placeholder="Opcional"
      />

      <FormInput
        name="changeAmount"
        label="Vuelto"
        type="number"
        placeholder="Opcional"
      />

      <FormSubmit
        value="Cerrar mesa"
        loadingText="Cerrando..."
        disabled={isPending}
      />
    </Form>
  );
}
