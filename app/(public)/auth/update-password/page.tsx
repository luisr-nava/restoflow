import { AuthShowcase } from "@/src/features/auth/components/auth-showcase";
import { SetPasswordForm } from "@/src/features/auth/components/set-password-form";
import { createClient } from "@/src/lib/supabase/server";
import { Heading } from "@/src/shared/components/ui/Heading";
import { redirect } from "next/navigation";

export default async function UpdatePasswordPage() {
  return (
    <>
      <Heading className="pb-10">Inicio de sesión</Heading>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-8 lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16 lg:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <SetPasswordForm />
        </div>
        <AuthShowcase
          title="Protegé el acceso a tu restaurante."
          description="Elegí una nueva contraseña para continuar trabajando con normalidad."
        />
      </div>
    </>
  );
}

