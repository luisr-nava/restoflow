import { cookies } from "next/headers";

import type { StaffSession } from "../types/staff-auth.types";

const STAFF_SESSION_COOKIE = "restoflow_staff_session";

export async function setStaffSession(session: StaffSession) {
  const cookieStore = await cookies();

  cookieStore.set(STAFF_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();

  const session = cookieStore.get(STAFF_SESSION_COOKIE);

  if (!session?.value) {
    return null;
  }

  try {
    return JSON.parse(session.value) as StaffSession;
  } catch {
    return null;
  }
}

export async function clearStaffSession() {
  const cookieStore = await cookies();

  cookieStore.delete(STAFF_SESSION_COOKIE);
}
