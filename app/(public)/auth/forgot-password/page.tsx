import { AuthShowcase } from "@/src/features/auth/components/auth-showcase";
import { ForgotPasswordForm } from "@/src/features/auth/components/forgot-password-form";
import { SignUpForm } from "@/src/features/auth/components/sign-up-form";
import { Heading } from "@/src/shared/components/ui/Heading";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <>
      <Heading className="pb-10">Inicio de sesión</Heading>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-8 lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16 lg:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <ForgotPasswordForm />
        </div>
        <AuthShowcase
          title="Recuperá el acceso a tu cuenta."
          description="Te enviaremos instrucciones para restablecer tu contraseña de forma segura."
        />
      </div>
    </>
  );
}



