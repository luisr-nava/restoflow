"use client";

import { useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";

import { useGetReservations } from "../hooks/use-get-reservations";
import { CreateReservationModal } from "./create-reservation-modal";
import { ReservationCalendar } from "./reservation-calendar";
import { UpdateReservationModal } from "./update-reservation-modal";

export function ReservationsView() {
  const { data: reservations = [], error, isError, isLoading } =
    useGetReservations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createReservationStartsAt, setCreateReservationStartsAt] = useState<
    string | undefined
  >(undefined);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const selectedReservation =
    reservations.find((reservation) => reservation.id === selectedReservationId) ??
    null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Reservas
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Gestión de reservas
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Organizá la agenda del salón, visualizá la ocupación por día o
              semana y editá cada reserva desde el calendario.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateReservationStartsAt(undefined);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-text px-4 py-2.5 text-sm font-medium text-bg transition hover:opacity-90">
            Crear reserva
          </button>
        </div>

        {isLoading ? (
          <LoadingState label="Cargando reservas..." className="bg-surface" />
        ) : isError ? (
          <ErrorState
            title="No se pudieron cargar las reservas"
            description={error.message}
            className="bg-surface"
          />
        ) : (
          <div className="space-y-4">
            <ReservationCalendar
              reservations={reservations}
              onReservationSelect={setSelectedReservationId}
              onDateSelect={(startsAt) => {
                setCreateReservationStartsAt(startsAt);
                setIsCreateModalOpen(true);
              }}
            />

            {reservations.length === 0 && (
              <EmptyState
                title="Todavía no hay reservas cargadas"
                description="Creá la primera reserva para empezar a visualizar la agenda del restaurante."
                className="bg-surface"
              />
            )}
          </div>
        )}
      </div>

      <CreateReservationModal
        open={isCreateModalOpen}
        initialStartsAt={createReservationStartsAt}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateReservationStartsAt(undefined);
        }}
      />

      <UpdateReservationModal
        open={selectedReservationId !== null && selectedReservation !== null}
        reservation={selectedReservation}
        onClose={() => setSelectedReservationId(null)}
      />
    </>
  );
}
