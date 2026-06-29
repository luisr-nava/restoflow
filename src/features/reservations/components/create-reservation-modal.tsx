"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";

import { CreateReservationForm } from "./create-reservation-form";

type CreateReservationModalProps = {
  open: boolean;
  initialStartsAt?: string;
  onClose: () => void;
};

export function CreateReservationModal({
  open,
  initialStartsAt,
  onClose,
}: CreateReservationModalProps) {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Crear reserva"
      description="Registrá una nueva reserva y asignale una mesa del restaurante."
      size="lg">
      <CreateReservationForm
        initialStartsAt={initialStartsAt}
        onSuccess={onClose}
      />
    </AppDialog>
  );
}
