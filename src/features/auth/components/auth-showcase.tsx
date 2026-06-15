import { Heading } from "@/src/shared/components/ui/Heading";

type Props = {
  title: string;
  description: string;
};

export function AuthShowcase({ title, description }: Props) {
  return (
    <aside className="hidden lg:block">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-3">
        RestoFlow
      </p>

      <Heading level={1} className="max-w-lg text-left text-5xl">
        {title}
      </Heading>

      <p className="mt-5 max-w-md text-sm leading-6 text-text-2">
        {description}
      </p>
    </aside>
  );
}
{
  /* <AuthShowcase
  title="Confirmá tu dirección de correo."
  description="Verificá tu cuenta para comenzar a administrar tu restaurante."
/>;<AuthShowcase
  title="Tu restaurante está listo para comenzar."
  description="Revisá tu correo electrónico para activar tu cuenta."
/>; */
}

