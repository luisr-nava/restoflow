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

import { useCreateReservation } from "../hooks/use-create-reservation";
import { CreateReservationSchema } from "../schemas/reservation.schema";
import type { CreateReservationInput } from "../types/reservation.types";

type CreateReservationFormProps = {
  initialStartsAt?: string;
  onSuccess?: () => void;
};

function getDefaultStartsAtValue() {
  const now = new Date();
  const rounded = new Date(now);
  const minutes = rounded.getMinutes();

  if (minutes === 0) {
    rounded.setSeconds(0, 0);
  } else if (minutes <= 30) {
    rounded.setMinutes(30, 0, 0);
  } else {
    rounded.setHours(rounded.getHours() + 1, 0, 0, 0);
  }

  const offsetInMs = rounded.getTimezoneOffset() * 60_000;

  return new Date(rounded.getTime() - offsetInMs).toISOString().slice(0, 16);
}

function getInitialStartsAtValue(initialStartsAt?: string) {
  return initialStartsAt || getDefaultStartsAtValue();
}

export function CreateReservationForm({
  initialStartsAt,
  onSuccess,
}: CreateReservationFormProps) {
  const form = useForm<CreateReservationInput>({
    resolver: zodResolver(CreateReservationSchema) as Resolver<CreateReservationInput>,
    defaultValues: {
      tableId: "",
      customerName: "",
      customerPhone: "",
      partySize: 2,
      startsAt: getInitialStartsAtValue(initialStartsAt),
      durationMinutes: 60,
      notes: "",
    },
  });

  useEffect(() => {
    form.reset({
      tableId: "",
      customerName: "",
      customerPhone: "",
      partySize: 2,
      startsAt: getInitialStartsAtValue(initialStartsAt),
      durationMinutes: 60,
      notes: "",
    });
  }, [form, initialStartsAt]);

  const { mutate, isPending } = useCreateReservation();
  const {
    data: tables = [],
    error,
    isError,
    isLoading,
  } = useGetRestaurantTables();

  const availableTables = tables.filter((table) => table.status !== "CLOSED");

  const onSubmit = (input: CreateReservationInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset({
          tableId: "",
          customerName: "",
          customerPhone: "",
          partySize: 2,
          startsAt: getInitialStartsAtValue(initialStartsAt),
          durationMinutes: 60,
          notes: "",
        });

        onSuccess?.();
      },
    });
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

  if (availableTables.length === 0) {
    return (
      <EmptyState
        title="No hay mesas disponibles para reservar"
        description="Necesitás al menos una mesa activa en el restaurante para crear reservas."
        className="rounded-none border-0 bg-transparent px-0 py-0 text-left"
      />
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormSelect name="tableId" label="Mesa">
        <option value="">Seleccioná una mesa</option>

        {availableTables.map((table) => (
          <option key={table.id} value={table.id}>
            {table.name} · {table.seats} comensales
          </option>
        ))}
      </FormSelect>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          name="customerName"
          label="Cliente"
          placeholder="Ej: Ana Gómez"
        />

        <FormInput
          name="customerPhone"
          label="Teléfono"
          placeholder="Ej: +54 11 1234-5678"
        />
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

      <FormInput
        name="startsAt"
        label="Inicio"
        type="datetime-local"
      />

      <FormTextArea
        name="notes"
        label="Notas"
        placeholder="Alergias, aniversario, preferencias de ubicación..."
      />

      <FormSubmit
        value="Crear reserva"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
