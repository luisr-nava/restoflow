export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
        <span className="bg-accent size-1.5 rounded-full" />
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-3">
          Interactive prototype
        </span>
      </div>

      <h1 className="max-w-4xl font-serif text-6xl leading-none tracking-tight md:text-7xl">
        One <span className="font-sans font-medium">restaurant OS</span>,
        <br />
        four surfaces, shared state.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-2">
        A multi-tenant platform for QR ordering, waiter workflow, and kitchen
        operations. Orders placed in one surface appear in real time across the
        entire restaurant ecosystem.
      </p>
    </section>
  );
}

