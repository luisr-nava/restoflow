"use server";
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  SetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyEmailSchema,
} from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  SetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from "../types/auth.types";

export async function signUpAction(input: SignUpInput) {
  const data = SignUpSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.register(data.data);
}

export async function signInAction(input: SignInInput) {
  const data = SignInSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.login(data.data);
}

export async function setPasswordAction(input: SetPasswordInput) {
  const data = SetPasswordSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.changePassword({
    currentPassword: "",
    newPassword: data.data.newPassword,
    passwordConfirmation: data.data.passwordConfirmation,
    revokeOtherSessions: false,
  });
}

export async function changePasswordAction(input: ChangePasswordInput) {
  const data = ChangePasswordSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.changePassword(data.data);
}

export async function logoutAction() {
  return authService.logout();
}

export async function verifyEmailAction(input: VerifyEmailInput) {
  const data = VerifyEmailSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.verifyEmail(data.data);
}

export async function resendVerificationAction(email: string) {
  return await authService.resendVerification(email);
}

export async function requestPasswordResetAction(input: ForgotPasswordInput) {
  const data = ForgotPasswordSchema.safeParse(input);

  if (!data.success) {
    return {
      error: "Hubo un error",
      success: "",
    };
  }

  return authService.requestPasswordReset(data.data);
}

