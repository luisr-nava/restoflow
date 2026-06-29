"use client";

import type { ComponentProps } from "react";
import esLocale from "@fullcalendar/core/locales/es";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import type { ReservationWithTable } from "../types/reservation.types";

type ReservationCalendarProps = {
  reservations: ReservationWithTable[];
  onReservationSelect: (reservationId: string) => void;
  onDateSelect: (startsAt: string) => void;
};

type FullCalendarEventClickArg = Parameters<
  NonNullable<ComponentProps<typeof FullCalendar>["eventClick"]>
>[0];
type FullCalendarDateClickArg = Parameters<
  NonNullable<ComponentProps<typeof FullCalendar>["dateClick"]>
>[0];

const reservationStatusStyles = {
  ACTIVE: {
    backgroundColor: "oklch(0.96 0.05 190)",
    borderColor: "oklch(0.62 0.12 190)",
    textColor: "oklch(0.35 0.1 190)",
  },
  CANCELED: {
    backgroundColor: "oklch(0.96 0.04 25)",
    borderColor: "oklch(0.58 0.18 25)",
    textColor: "oklch(0.58 0.18 25)",
  },
  COMPLETED: {
    backgroundColor: "oklch(0.95 0.04 155)",
    borderColor: "oklch(0.6 0.14 155)",
    textColor: "oklch(0.35 0.12 155)",
  },
} as const;

export function ReservationCalendar({
  reservations,
  onReservationSelect,
  onDateSelect,
}: ReservationCalendarProps) {
  const events = reservations.map((reservation) => {
    const tableName = reservation.restaurant_tables?.name ?? "Mesa sin nombre";
    const styles = reservationStatusStyles[reservation.status];

    return {
      id: reservation.id,
      title: `${reservation.customer_name} · ${tableName}`,
      start: reservation.starts_at,
      end: reservation.ends_at,
      backgroundColor: styles.backgroundColor,
      borderColor: styles.borderColor,
      textColor: styles.textColor,
    };
  });

  return (
    <div
      className={[
        "rounded-2xl border border-border bg-background p-4 shadow-sm",
        "[&_.fc]:font-sans [&_.fc]:text-sm [&_.fc-theme-standard_td]:border-border",
        "[&_.fc-theme-standard_th]:border-border [&_.fc-theme-standard_.fc-scrollgrid]:border-border",
        "[&_.fc-col-header-cell]:bg-surface [&_.fc-col-header-cell]:py-3",
        "[&_.fc-toolbar]:flex-wrap [&_.fc-toolbar]:gap-3 [&_.fc-toolbar]:pb-4",
        "[&_.fc-toolbar-title]:font-serif [&_.fc-toolbar-title]:text-2xl [&_.fc-toolbar-title]:italic [&_.fc-toolbar-title]:text-text",
        "[&_.fc-button]:rounded-lg [&_.fc-button]:border [&_.fc-button]:border-border [&_.fc-button]:bg-surface [&_.fc-button]:px-3 [&_.fc-button]:py-2 [&_.fc-button]:text-xs [&_.fc-button]:font-medium [&_.fc-button]:uppercase [&_.fc-button]:tracking-[0.08em] [&_.fc-button]:text-text [&_.fc-button]:shadow-none",
        "[&_.fc-button:hover]:bg-surface-2 [&_.fc-button-primary:not(:disabled).fc-button-active]:border-text [&_.fc-button-primary:not(:disabled).fc-button-active]:bg-text [&_.fc-button-primary:not(:disabled).fc-button-active]:text-bg",
        "[&_.fc-daygrid-day.fc-day-today]:bg-accent-soft/40 [&_.fc-timegrid-col.fc-day-today]:bg-accent-soft/30",
        "[&_.fc-event]:cursor-pointer [&_.fc-event]:rounded-md [&_.fc-event]:px-1.5 [&_.fc-event]:py-0.5 [&_.fc-event]:text-xs [&_.fc-event]:font-medium",
        "[&_.fc-list-event:hover_td]:bg-surface-2 [&_.fc-timegrid-slot-label]:text-text-3 [&_.fc-timegrid-axis]:text-text-3",
      ].join(" ")}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        allDaySlot={false}
        height="auto"
        editable={false}
        eventStartEditable={false}
        eventDurationEditable={false}
        events={events}
        dateClick={(info: FullCalendarDateClickArg) => {
          const clickedDate = new Date(info.date);

          if (info.allDay) {
            clickedDate.setHours(12, 0, 0, 0);
          }

          const offsetInMs = clickedDate.getTimezoneOffset() * 60_000;
          const startsAt = new Date(clickedDate.getTime() - offsetInMs)
            .toISOString()
            .slice(0, 16);

          onDateSelect(startsAt);
        }}
        eventClick={(info: FullCalendarEventClickArg) => {
          onReservationSelect(info.event.id);
        }}
      />
    </div>
  );
}
