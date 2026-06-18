import { StaffLoginForm } from "@/src/features/team/components/StaffLoginForm";

export default function StaffLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Acceso del personal
          </h1>

          <p className="text-sm text-muted-foreground">
            Ingresá con tu email y PIN para acceder a tu vista de trabajo.
          </p>
        </div>

        <StaffLoginForm />
      </section>
    </main>
  );
}

