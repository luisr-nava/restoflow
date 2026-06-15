import { AuthShowcase } from "@/src/features/auth/components/auth-showcase";
import { SignInForm } from "@/src/features/auth/components/sign-in-form";
import { Heading } from "@/src/shared/components/ui/Heading";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <Heading className="pb-10">Inicio de sesión</Heading>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-8 lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16 lg:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
          <SignInForm />
          <div className="text-sm flex justify-between mt-2">
            <Link href={"/auth/sign-up"} className="underline text-gray-400">
              ¿No tienes cuenta? Crea una
            </Link>
            <Link
              href={"/auth/forgot-password"}
              className="underline text-gray-400">
              Olvidaste tu password
            </Link>
          </div>
        </div>
        <AuthShowcase
          title="Todo tu restaurante, siempre sincronizado."
          description="Accedé a pedidos, mesas y operaciones en tiempo real."
        />
      </div>
    </>
  );
}


