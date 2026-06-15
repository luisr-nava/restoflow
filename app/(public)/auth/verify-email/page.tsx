import { Heading } from "@/src/shared/components/ui/Heading";
import { AuthShowcase } from "@/src/features/auth/components/auth-showcase";
import { VerifyEmail } from "@/src/features/auth/components/verify-email";

export default async function VerifyEmailPage() {
  return (
    <section className="min-h-[calc(100vh-64px)]">
      <Heading className="pb-10">Verificar cuenta</Heading>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-8 lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16 lg:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <VerifyEmail />
        </div>

        <AuthShowcase
          title="Confirmá tu dirección de correo."
          description="Ingresá el código de 6 dígitos enviado a tu email para activar tu cuenta de RestoFlow."
        />
      </div>
    </section>
  );
}

