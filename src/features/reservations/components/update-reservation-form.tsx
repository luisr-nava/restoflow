"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
  FormTextArea,
} from "@/src/shared/components/forms";
import { useGetRestaurantTables } from "@/src/features/tables/hooks/use-get-restaurant-tables";

import { useCancelReservation } from "../hooks/use-cancel-reservation";
import { useUpdateReservation } from "../hooks/use-update-reservation";
import { UpdateReservationSchema } from "../schemas/reservation.schema";
import type {
  ReservationStatus,
  ReservationWithTable,
  UpdateReservationInput,
} from "../types/reservation.types";

type UpdateReservationFormProps = {
  reservation: ReservationWithTable;
  onSuccess?: () => void;
};

const reservationStatusOptions: Array<{
  label: string;
  value: ReservationStatus;
}> = [
  {
    label: "Activa",
    value: "ACTIVE",
  },
  {
    label: "Completada",
    value: "COMPLETED",
  },
  {
    label: "Cancelada",
    value: "CANCELED",
  },
];

function toDateTimeLocalValue(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetInMs = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offsetInMs).toISOString().slice(0, 16);
}

export function UpdateReservationForm({
  reservation,
  onSuccess,
}: UpdateReservationFormProps) {
  const form = useForm<UpdateReservationInput>({
    resolver: zodResolver(UpdateReservationSchema) as Resolver<UpdateReservationInput>,
    defaultValues: {
      reservationId: reservation.id,
      tableId: reservation.table_id,
      customerName: reservation.customer_name,
      customerPhone: reservation.customer_phone,
      partySize: reservation.party_size,
      startsAt: toDateTimeLocalValue(reservation.starts_at),
      durationMinutes: reservation.duration_minutes,
      notes: reservation.notes ?? "",
      status: reservation.status,
    },
  });

  useEffect(() => {
    form.reset({
      reservationId: reservation.id,
      tableId: reservation.table_id,
      customerName: reservation.customer_name,
      customerPhone: reservation.customer_phone,
      partySize: reservation.party_size,
      startsAt: toDateTimeLocalValue(reservation.starts_at),
      durationMinutes: reservation.duration_minutes,
      notes: reservation.notes ?? "",
      status: reservation.status,
    });
  }, [form, reservation]);

  const { mutate: updateReservation, isPending: isUpdating } =
    useUpdateReservation();
  const { mutate: cancelReservation, isPending: isCanceling } =
    useCancelReservation();
  const {
    data: tables = [],
    error,
    isError,
    isLoading,
  } = useGetRestaurantTables();

  const onSubmit = (input: UpdateReservationInput) => {
    updateReservation(input, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleCancelReservation = () => {
    cancelReservation(
      {
        reservationId: reservation.id,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <LoadingState
        label="Cargando mesas..."
        className="rounded-none border-0 bg-transparent px-0 py-0 text-left"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudieron cargar las mesas"
        description={error.message}
        className="rounded-none border-0 bg-transparent px-0 py-0 text-left"
      />
    );
  }

  if (tables.length === 0) {
    return (
      <EmptyState
        title="No hay mesas para vincular"
        description="No encontramos mesas disponibles en el restaurante."
        className="rounded-none border-0 bg-transparent px-0 py-0 text-left"
      />
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("reservationId")} />

      <FormSelect name="tableId" label="Mesa">
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.name} · {table.seats} comensales · {table.status}
          </option>
        ))}
      </FormSelect>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput name="customerName" label="Cliente" />
        <FormInput name="customerPhone" label="Teléfono" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          name="partySize"
          label="Cantidad de personas"
          type="number"
          min={1}
        />
        <FormInput
          name="durationMinutes"
          label="Duración (minutos)"
          type="number"
          min={15}
          step={15}
        />
      </div>

      <FormInput name="startsAt" label="Inicio" type="datetime-local" />

      <FormSelect name="status" label="Estado">
        {reservationStatusOptions.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </FormSelect>

      <FormTextArea
        name="notes"
        label="Notas"
        placeholder="Notas internas o preferencias del cliente"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCancelReservation}
          disabled={reservation.status !== "ACTIVE" || isUpdating || isCanceling}
          className="inline-flex items-center justify-center rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          {isCanceling ? "Cancelando..." : "Cancelar reserva"}
        </button>

        <FormSubmit
          value="Guardar cambios"
          loadingText="Guardando..."
          disabled={isUpdating || isCanceling}
          className="sm:flex-1"
        />
      </div>
    </Form>
  );
}
