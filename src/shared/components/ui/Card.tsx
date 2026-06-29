import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cardVariantClassName = {
  default: "border border-border bg-background",
  muted: "border border-border bg-surface",
} as const;

const cardSizeClassName = {
  sm: "rounded-xl p-3",
  md: "rounded-xl p-4",
  lg: "rounded-2xl p-6",
} as const;

type CardVariant = keyof typeof cardVariantClassName;
type CardSize = keyof typeof cardSizeClassName;

type CardOwnProps = {
  children?: ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
};

type CardProps<T extends ElementType> = CardOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;

export function Card<T extends ElementType = "div">({
  as,
  className,
  variant = "default",
  size = "md",
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={twMerge(
        clsx(cardVariantClassName[variant], cardSizeClassName[size]),
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("flex flex-col gap-1.5"), className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(clsx("font-semibold text-foreground"), className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(clsx("text-sm text-muted-foreground"), className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge(className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("flex items-center"), className)}
      {...props}
    />
  );
}
