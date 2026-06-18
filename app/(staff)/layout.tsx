import { redirect } from "next/navigation";

import { getStaffSession } from "@/src/features/team/lib/staff-session";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();

  if (!session) {
    redirect("/staff/login");
  }

  return <main className="min-h-screen bg-background">{children}</main>;
}

