import type {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CodeVerification,
  SignInInput,
  SignUpInput,
} from "../types/auth.types";
import { supabaseAdmin } from "@/src/lib/supabase/admin";

export interface IAuthRepository {
  signUp(supabase: SupabaseClient, input: SignUpInput): Promise<AuthResponse>;
  signIn(
    supabase: SupabaseClient,
    input: SignInInput,
  ): Promise<AuthTokenResponsePassword>;
  signOut(supabase: SupabaseClient): Promise<{ error: Error | null }>;
  getUser(supabase: SupabaseClient): Promise<UserResponse>;
  userExists(email: string): Promise<User | null>;

  resetPasswordForEmail(
    supabase: SupabaseClient,
    email: string,
    redirectTo: string,
  ): ReturnType<SupabaseClient["auth"]["resetPasswordForEmail"]>;
  updatePassword(
    supabase: SupabaseClient,
    newPassword: string,
  ): ReturnType<SupabaseClient["auth"]["updateUser"]>;

  revokeOtherSessions(
    supabase: SupabaseClient,
  ): Promise<{ error: Error | null }>;

  findVerificationCode(code: string): Promise<CodeVerification | null>;
  deleteVerificationCode(id: string): Promise<void>;
  verifyUser(userId: string): Promise<{ error: Error | null }>;
  resendVerificationCode(
    userId: string,
    code: string,
    expiresAt: string,
  ): Promise<void>;
}

class AuthRepository implements IAuthRepository {
  async signUp(
    supabase: SupabaseClient,
    input: SignUpInput,
  ): Promise<AuthResponse> {
    return supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/verify-email",
        data: {
          name: input.name,
        },
      },
    });
  }

  async signIn(
    supabase: SupabaseClient,
    input: SignInInput,
  ): Promise<AuthTokenResponsePassword> {
    return supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
  }
  async signOut(supabase: SupabaseClient): Promise<{ error: Error | null }> {
    return supabase.auth.signOut();
  }

  async getUser(supabase: SupabaseClient): Promise<UserResponse> {
    return supabase.auth.getUser();
  }

  async userExists(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    return (
      data.users.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase(),
      ) ?? null
    );
  }

  async resetPasswordForEmail(
    supabase: SupabaseClient,
    email: string,
    redirectTo: string,
  ) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  }
  async updatePassword(supabase: SupabaseClient, newPassword: string) {
    return supabase.auth.updateUser({
      password: newPassword,
    });
  }
  async revokeOtherSessions(
    supabase: SupabaseClient,
  ): Promise<{ error: Error | null }> {
    return supabase.auth.signOut({
      scope: "others",
    });
  }

  async findVerificationCode(code: string) {
    const { data, error } = await supabaseAdmin
      .from("code_verifications")
      .select("*")
      .eq("code", code)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) return null;

    return data;
  }

  async deleteVerificationCode(id: string): Promise<void> {
    await supabaseAdmin.from("code_verifications").delete().eq("id", id);
  }

  async verifyUser(userId: string): Promise<{ error: Error | null }> {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    return { error };
  }

  async resendVerificationCode(
    userId: string,
    code: string,
    expiresAt: string,
  ): Promise<void> {
    await supabaseAdmin.from("code_verifications").upsert(
      {
        user_id: userId,
        code,
        expires_at: expiresAt,
      },
      {
        onConflict: "user_id",
      },
    );
  }
}

export const authRepository = new AuthRepository();

