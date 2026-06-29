"use client";

import { useGetTodayReservations } from "@/src/features/reservations/hooks/use-get-today-reservations";

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TodayReservationsCard() {
  const {
    data: reservations = [],
    error,
    isError,
    isLoading,
  } = useGetTodayReservations();

  const activeReservations = reservations
    .filter((reservation) => reservation.status === "ACTIVE")
    .sort(
      (firstReservation, secondReservation) =>
        new Date(firstReservation.starts_at).getTime() -
        new Date(secondReservation.starts_at).getTime(),
    );

  const nextReservations = activeReservations.slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Reservas de hoy
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeReservations.length} activas
          </p>
        </div>

        <div className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-accent-ink">
          {activeReservations.length}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-16 rounded-xl border border-border bg-background"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-4 text-sm text-danger">
          {error.message || "No se pudieron cargar las reservas de hoy"}
        </p>
      ) : nextReservations.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No hay reservas para hoy
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {nextReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {reservation.customer_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {reservation.restaurant_tables?.name ?? "Mesa sin nombre"}
                  </p>
                </div>

                <p className="font-mono text-xs uppercase tracking-[0.08em] text-text-3">
                  {formatTime(reservation.starts_at)}
                </p>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {reservation.party_size}{" "}
                {reservation.party_size === 1 ? "persona" : "personas"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
