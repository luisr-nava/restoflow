"use client";

import { useGetTodayReservations } from "@/src/features/reservations/hooks/use-get-today-reservations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

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
    <Card variant="muted" size="md">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">Reservas de hoy</CardTitle>
          <CardDescription>{activeReservations.length} activas</CardDescription>
        </div>

        <div className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-accent-ink">
          {activeReservations.length}
        </div>
      </CardHeader>

      {isLoading ? (
        <CardContent className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-border bg-background p-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </CardContent>
      ) : isError ? (
        <p className="mt-4 text-sm text-danger">
          {error.message || "No se pudieron cargar las reservas de hoy"}
        </p>
      ) : nextReservations.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No hay reservas para hoy
        </p>
      ) : (
        <CardContent className="mt-4 space-y-3">
          {nextReservations.map((reservation) => (
            <Card
              key={reservation.id}
              variant="default"
              size="sm">
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
            </Card>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
