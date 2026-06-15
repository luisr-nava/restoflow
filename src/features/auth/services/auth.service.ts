import { User } from "@supabase/supabase-js";
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from "../types/auth.types";
import {
  authRepository,
  IAuthRepository,
} from "../repositories/auth.repository";
import { createClient } from "@/src/lib/supabase/server";
import { supabaseAdmin } from "@/src/lib/supabase/admin";

import { generateOtp } from "../lib/generate-otp";
import { sendOtpEmail } from "../lib/send-otp-email";

class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}
  private async getSupabase() {
    return createClient();
  }
  async register(credentials: SignUpInput) {
    const { email } = credentials;

    const user = await this.authRepository.userExists(email);

    if (user) {
      return {
        error: "Este e-mail ya está registrado",
        success: "",
      };
    }
    const supabase = await this.getSupabase();

    try {
      const { data, error } = await this.authRepository.signUp(
        supabase,
        credentials,
      );

      if (error || !data.user) {
        return {
          error: error?.message || "Error al crear usuario",
          success: "",
        };
      }

      const code = generateOtp();

      const { data: verificationData, error: verificationError } =
        await supabaseAdmin
          .from("code_verifications")
          .upsert(
            {
              user_id: data.user.id,
              code,
              expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            },
            {
              onConflict: "user_id",
            },
          )
          .select()
          .single();

      if (verificationError || !verificationData) {
        return {
          error: `No se pudo guardar el código de verificación: ${verificationError?.message}`,
          success: "",
        };
      }

      await sendOtpEmail(email, code);

      return {
        error: "",
        success: "Cuenta creada correctamente",
      };
    } catch {
      return {
        error: "No se pudo crear la cuenta",
        success: "",
      };
    }
  }

  async login(credentials: SignInInput) {
    const { email } = credentials;

    const user = await this.authRepository.userExists(email);

    if (!user) {
      return {
        error: "El usuario no existe",
        success: "",
      };
    }
    const supabase = await this.getSupabase();
    try {
      const { error } = await this.authRepository.signIn(supabase, credentials);

      if (error) {
        return {
          error: "Email o password incorrecto",
          success: "",
        };
      }

      return {
        error: "",
        success: "Sesión iniciada correctamente",
      };
    } catch {
      return {
        error: "No se pudo iniciar sesión",
        success: "",
      };
    }
  }

  async logout() {
    const supabase = await this.getSupabase();
    try {
      const { error } = await this.authRepository.signOut(supabase);

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }

      return {
        error: "",
        success: "Sesión cerrada correctamente",
      };
    } catch {
      return {
        error: "No se pudo cerrar sesión",
        success: "",
      };
    }
  }
  async getUser(): Promise<User | null> {
    const supabase = await this.getSupabase();
    const { data, error } = await this.authRepository.getUser(supabase);

    if (error) {
      throw error;
    }

    return data.user;
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.authRepository.userExists(email);

    return !!user;
  }

  async requestPasswordReset(input: ForgotPasswordInput) {
    const user = await this.authRepository.userExists(input.email);

    if (!user) {
      return {
        error: "El usuario no existe",
        success: "",
      };
    }

    const supabase = await this.getSupabase();

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password/confirm`;

    const { error } = await this.authRepository.resetPasswordForEmail(
      supabase,
      input.email,
      redirectTo,
    );

    if (error) {
      return {
        error: error.message,
        success: "",
      };
    }

    return {
      error: "",
      success: "Te enviamos un email para recuperar tu contraseña",
    };
  }

  async changePassword(input: ChangePasswordInput) {
    const { newPassword, revokeOtherSessions } = input;
    const supabase = await this.getSupabase();

    const { error } = await this.authRepository.updatePassword(
      supabase,
      newPassword,
    );

    if (error) {
      return {
        error: error.message,
        success: "",
      };
    }
    if (revokeOtherSessions) {
      const { error } = await this.authRepository.revokeOtherSessions(supabase);

      if (error) {
        return {
          error: error.message,
          success: "",
        };
      }
    }
    return {
      error: "",
      success: "El password se actualizó correctamente",
    };
  }
  async verifyEmail(input: VerifyEmailInput) {
    const { token } = input;

    const record = await this.authRepository.findVerificationCode(token!);

    if (!record) {
      return {
        error: "Código inválido",
        success: "",
      };
    }

    if (new Date(record.expires_at) < new Date()) {
      await this.authRepository.deleteVerificationCode(record.id);

      return {
        error: "El código expiró",
        success: "",
      };
    }

    // verificar usuario en Supabase
    const { error: verifyError } = await this.authRepository.verifyUser(
      record.user_id,
    );

    if (verifyError) {
      return {
        error: "No se pudo verificar el usuario",
        success: "",
      };
    }

    // eliminar código (one-time)
    await this.authRepository.deleteVerificationCode(record.id);

    return {
      error: "",
      success: "Cuenta verificada correctamente",
    };
  }
  async resendVerification(email: string) {
    const user = await this.authRepository.userExists(email);

    if (!user) {
      return {
        error: "El usuario no existe",
        success: "",
      };
    }
    if (user.email_confirmed_at) {
      return {
        error: "La cuenta ya se encuentra verificada",
        success: "",
      };
    }
    const code = generateOtp();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await this.authRepository.resendVerificationCode(user.id, code, expiresAt);

    await sendOtpEmail(email, code);

    return {
      error: "",
      success: "Nuevo código enviado",
    };
  }
}

export const authService = new AuthService(authRepository);

