import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function SubHeading({ children, className }: Props) {
  return (
    <p
      className={clsx(
        "mx-auto max-w-md text-center text-sm leading-6 text-text-2",
        className,
      )}>
      {children}
    </p>
  );
}
