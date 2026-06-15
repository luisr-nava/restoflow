import { AuthShowcase } from "@/src/features/auth/components/auth-showcase";
import { SignUpForm } from "@/src/features/auth/components/sign-up-form";
import { Heading } from "@/src/shared/components/ui/Heading";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <Heading className="pb-10">Registro</Heading>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-8 lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16 lg:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <SignUpForm />
          <div className="text-sm flex justify-between mt-2">
            <Link href={"/auth/sign-in"} className="underline text-gray-400">
              ¿Tienes cuenta? Inicia sesión
            </Link>
            <Link
              href={"/auth/forgot-password"}
              className="underline text-gray-400">
              Olvidaste tu password
            </Link>
          </div>
        </div>
        <AuthShowcase
          title="Gestioná tu restaurante desde una sola plataforma."
          description="Pedidos por QR, mozos, cocina, mesas y menú."
        />
      </div>
    </>
  );
}


