import type { SupabaseClient } from "@supabase/supabase-js";

type CreateStaffSessionParams = {
  staffId: string;
  tokenHash: string;
  expiresAt: string;
};

export interface IStaffSessionRepository {
  createSession(
    supabase: SupabaseClient,
    input: CreateStaffSessionParams,
  ): Promise<{ error: Error | null }>;

  findSessionByTokenHash(
    supabase: SupabaseClient,
    tokenHash: string,
  ): Promise<{ data: { staff_id: string } | null; error: Error | null }>;

  deleteSessionByTokenHash(
    supabase: SupabaseClient,
    tokenHash: string,
  ): Promise<{ error: Error | null }>;
}

class StaffSessionRepository implements IStaffSessionRepository {
  async createSession(
    supabase: SupabaseClient,
    input: CreateStaffSessionParams,
  ) {
    const { error } = await supabase.from("staff_sessions").insert({
      staff_id: input.staffId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
    });

    return { error };
  }

  async findSessionByTokenHash(supabase: SupabaseClient, tokenHash: string) {
    const { data, error } = await supabase
      .from("staff_sessions")
      .select("staff_id")
      .eq("token_hash", tokenHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    return { data, error };
  }

  async deleteSessionByTokenHash(supabase: SupabaseClient, tokenHash: string) {
    const { error } = await supabase
      .from("staff_sessions")
      .delete()
      .eq("token_hash", tokenHash);

    return { error };
  }
}

export const staffSessionRepository = new StaffSessionRepository();
