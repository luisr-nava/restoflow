import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

import { staffSessionRepository } from "../repositories/staff-session.repository";
import type {
  StaffCookieSession,
  StaffSession,
} from "../types/staff-auth.types";
import type { RestaurantStaff } from "../types/team.types";

const STAFF_SESSION_COOKIE = "restoflow_staff_session";
const STAFF_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function setStaffSession(session: StaffSession) {
  const cookieStore = await cookies();
  const supabase = createServiceRoleClient();

  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + STAFF_SESSION_MAX_AGE_SECONDS * 1000,
  ).toISOString();

  const { error } = await staffSessionRepository.createSession(supabase, {
    staffId: session.id,
    tokenHash,
    expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  const cookieSession: StaffCookieSession = {
    token,
  };

  cookieStore.set(STAFF_SESSION_COOKIE, JSON.stringify(cookieSession), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: STAFF_SESSION_MAX_AGE_SECONDS,
  });
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const supabase = createServiceRoleClient();

  const sessionCookie = cookieStore.get(STAFF_SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const cookieSession = JSON.parse(sessionCookie.value) as StaffCookieSession;

    if (!cookieSession.token) {
      return null;
    }

    const tokenHash = hashToken(cookieSession.token);

    const { data: storedSession, error: sessionError } =
      await staffSessionRepository.findSessionByTokenHash(supabase, tokenHash);

    if (sessionError || !storedSession) {
      return null;
    }

    const { data: staff, error: staffError } = await supabase
      .from("restaurant_staff")
      .select("*")
      .eq("id", storedSession.staff_id)
      .eq("is_active", true)
      .maybeSingle<RestaurantStaff>();

    if (staffError || !staff) {
      return null;
    }

    return {
      id: staff.id,
      restaurantId: staff.restaurant_id,
      name: staff.name,
      email: staff.email ?? "",
      role: staff.role,
    };
  } catch {
    return null;
  }
}

export async function clearStaffSession() {
  const cookieStore = await cookies();
  const supabase = createServiceRoleClient();

  const sessionCookie = cookieStore.get(STAFF_SESSION_COOKIE);

  if (sessionCookie?.value) {
    try {
      const cookieSession = JSON.parse(
        sessionCookie.value,
      ) as StaffCookieSession;

      if (cookieSession.token) {
        await staffSessionRepository.deleteSessionByTokenHash(
          supabase,
          hashToken(cookieSession.token),
        );
      }
    } catch {
      // Ignorar cookie inválida.
    }
  }

  cookieStore.delete(STAFF_SESSION_COOKIE);
}
