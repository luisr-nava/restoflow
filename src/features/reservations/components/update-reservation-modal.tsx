"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";

import type { ReservationWithTable } from "../types/reservation.types";
import { UpdateReservationForm } from "./update-reservation-form";

type UpdateReservationModalProps = {
  open: boolean;
  onClose: () => void;
  reservation: ReservationWithTable | null;
};

export function UpdateReservationModal({
  open,
  onClose,
  reservation,
}: UpdateReservationModalProps) {
  return (
    <AppDialog
      open={open && reservation !== null}
      onClose={onClose}
      title="Editar reserva"
      description="Actualizá la mesa, los datos del cliente o el estado de la reserva."
      size="lg">
      {reservation ? (
        <UpdateReservationForm reservation={reservation} onSuccess={onClose} />
      ) : null}
    </AppDialog>
  );
}
