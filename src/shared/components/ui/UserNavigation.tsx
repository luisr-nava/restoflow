"use client";

import Link from "next/link";

export function UserNavigation() {
  return (
    <nav className="flex items-center gap-3">
      <Link
        // href="/dashboard"
        href="/"
        className="text-text-3 hover:text-text text-sm transition-colors">
        Dashboard
      </Link>

      {/* <form action={logoutAction}>
        <button
          type="submit"
          className="border-border text-text-2 hover:text-text hover:bg-surface-2 rounded-lg border px-4 py-2 text-sm transition-colors">
          Salir
        </button>
      </form> */}
    </nav>
  );
}
