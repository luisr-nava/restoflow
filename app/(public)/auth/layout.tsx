type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <section className="min-h-[calc(100vh-64px)] pt-10">{children}</section>
  );
}
