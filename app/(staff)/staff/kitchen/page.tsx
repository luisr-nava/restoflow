import { redirect } from "next/navigation";
import type { Route } from "next";

import { StaffKitchenView } from "@/src/features/orders/components/staff-kitchen-view";
import { StaffHeader } from "@/src/features/team/components/StaffHeader";
import { getStaffSession } from "@/src/features/team/lib/staff-session";

export default async function StaffKitchenPage() {
  const session = await getStaffSession();

  if (!session) {
    redirect("/staff/login" as Route);
  }

  if (session.role !== "KITCHEN") {
    redirect("/staff/waiter" as Route);
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
      <StaffHeader session={session} title="Vista de cocina" />

      <StaffKitchenView />
    </section>
  );
}
