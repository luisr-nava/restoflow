import { DashboardNavbar } from "@/src/features/dashboard/components/dashboard-navbar";
import { DashboardSidebar } from "@/src/features/dashboard/components/dashboard-sidebar";
import { PageTransition } from "@/src/shared/components/ui/PageTransition";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-bg text-text lg:grid lg:grid-cols-[232px_1fr]">
      <DashboardSidebar />

      <div className="min-w-0">
        <DashboardNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
