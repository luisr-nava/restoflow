import type { Route } from "next";
import { redirect } from "next/navigation";

import { StaffHeader } from "@/src/features/team/components/StaffHeader";
import { getStaffSession } from "@/src/features/team/lib/staff-session";
import { StaffWaiterView } from "@/src/features/team/components/staff-waiter-view";
export default async function StaffWaiterPage() {
  const session = await getStaffSession();

  if (!session) {
    redirect("/staff/login" as Route);
  }

  if (session.role !== "WAITER") {
    redirect("/staff/kitchen" as Route);
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
      <StaffHeader session={session} title="Vista del mozo" />
      <StaffWaiterView />
    </section>
  );
}

