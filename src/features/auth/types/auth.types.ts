import { z } from "zod";
import {
  ChangePasswordSchema,
  CheckPasswordSchema,
  ForgotPasswordSchema,
  ResendVerificationSchema,
  SetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyEmailSchema,
} from "../schemas/auth.schema";

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type SetPasswordInput = z.infer<typeof SetPasswordSchema>;
export type CheckPasswordInput = z.infer<typeof CheckPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;

export type CodeVerification = {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  created_at: string;
};

