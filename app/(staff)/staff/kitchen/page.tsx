import { redirect } from "next/navigation";
import type { Route } from "next";
import { getStaffSession } from "@/src/features/team/lib/staff-session";
import { StaffHeader } from "@/src/features/team/components/StaffHeader";

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

      <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
        Próximo paso: reutilizar el Kanban de pedidos de cocina que ya existe en
        /dashboard/kitchen.
      </div>
    </section>
  );
}


