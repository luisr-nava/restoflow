import Link from "next/link";

export function GuestNavigation() {
  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/auth/sign-in"
        className="text-text-3 hover:text-text text-sm transition-colors">
        Ingresar
      </Link>

      <Link
        href="/auth/sign-up"
        className="bg-text text-bg rounded-lg px-4 py-2 text-sm font-medium">
        Crear cuenta
      </Link>
    </nav>
  );
}

