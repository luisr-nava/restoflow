"use client";

import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CloseTableForm } from "./close-table-form";

type CloseTableModalProps = {
  tableId: string;
  total: number;
  disabled?: boolean;
  mode?: "admin" | "staff";
};

type CloseTableFormContentProps = Omit<CloseTableModalProps, "disabled"> & {
  onSuccess?: () => void;
};

function AdminCloseTableForm(props: CloseTableFormContentProps) {
  const { data: restaurantSettings } = useGetRestaurantSettings();

  return (
    <CloseTableForm
      tableId={props.tableId}
      total={props.total}
      mode={props.mode}
      currency={restaurantSettings?.data?.currency}
      onSuccess={props.onSuccess}
    />
  );
}

function StaffCloseTableForm(props: CloseTableFormContentProps) {
  const { data: staffRestaurantCurrency } = useGetStaffRestaurantCurrency();

  return (
    <CloseTableForm
      tableId={props.tableId}
      total={props.total}
      mode={props.mode}
      currency={staffRestaurantCurrency?.data?.currency}
      onSuccess={props.onSuccess}
    />
  );
}

function CloseTableFormContent({
  tableId,
  total,
  mode,
  onSuccess,
}: CloseTableFormContentProps) {
  if (mode === "staff") {
    return (
      <StaffCloseTableForm
        tableId={tableId}
        total={total}
        mode={mode}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <AdminCloseTableForm
      tableId={tableId}
      total={total}
      mode={mode}
      onSuccess={onSuccess}
    />
  );
}

export function CloseTableModal({
  tableId,
  total,
  disabled = false,
  mode = "admin",
}: CloseTableModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.closeTable?.open === true &&
      state.modals.closeTable?.payload?.tableId === tableId &&
      state.modals.closeTable?.payload?.mode === mode,
  );

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => openModal("closeTable", { tableId, mode })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40">
        Cerrar mesa
      </button>

      <AppDialog
        open={open}
        onClose={() => closeModal("closeTable")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Cobro
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Cerrar mesa
            </span>
          </>
        }
        size="md">
        <CloseTableFormContent
          tableId={tableId}
          total={total}
          mode={mode}
          onSuccess={() => closeModal("closeTable")}
        />
      </AppDialog>
    </>
  );
}
