import { createClient } from "@/src/lib/supabase/client";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Test Supabase</h1>

      <pre className="mt-4 rounded-md bg-neutral-900 p-4 text-sm text-white">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}

