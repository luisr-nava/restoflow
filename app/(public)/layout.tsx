import { Header } from "@/src/shared/components/ui/Header";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="bg-bg min-h-[calc(100vh-64px)]">{children}</main>
    </>
  );
}

