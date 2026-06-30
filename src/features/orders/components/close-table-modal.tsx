"use client";

import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import { useRestaurantSettingsContextFallback } from "@/src/features/restaurants/hooks/use-restaurant-settings-context";
import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
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
  const { restaurant } = useRestaurantSettingsContextFallback();

  return (
    <CloseTableForm
      tableId={props.tableId}
      total={props.total}
      mode={props.mode}
      currency={restaurant?.currency}
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
      <Button
        type="button"
        variant="danger"
        size="sm"
        disabled={disabled}
        onClick={() => openModal("closeTable", { tableId, mode })}>
        Cerrar mesa
      </Button>

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
        {open ? (
          <CloseTableFormContent
            tableId={tableId}
            total={total}
            mode={mode}
            onSuccess={() => closeModal("closeTable")}
          />
        ) : null}
      </AppDialog>
    </>
  );
}
