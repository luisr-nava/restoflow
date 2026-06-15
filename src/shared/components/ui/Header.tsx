import Link from "next/link";
import { UserNavigation } from "./UserNavigation";
import { GuestNavigation } from "./GuestNavigation";

type Props = {
  isAuthenticated?: boolean;
};

export function Header({ isAuthenticated = false }: Props) {
  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* <Logo /> */}Logo
        </Link>

        {isAuthenticated ? <UserNavigation /> : <GuestNavigation />}
      </div>
    </header>
  );
}

