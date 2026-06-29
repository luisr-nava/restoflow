import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const buttonVariantClassName = {
  primary: "bg-text text-bg",
  secondary:
    "border border-border bg-background text-foreground hover:bg-muted",
  outline: "border border-border text-foreground",
  ghost:
    "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "border border-red-200 text-red-600",
  success: "border border-green-200 text-green-600",
  link:
    "rounded-none p-0 text-muted-foreground underline underline-offset-2 hover:text-foreground",
} as const;

const buttonSizeClassName = {
  sm: "px-3 py-2 text-xs font-medium",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-4 py-3 text-sm font-medium",
  icon: "size-8 p-0 text-sm",
} as const;

export type ButtonVariant = keyof typeof buttonVariantClassName;
export type ButtonSize = keyof typeof buttonSizeClassName;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
};

function getButtonClassName({
  variant,
  size,
  loading,
  className,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  className?: string;
}) {
  const sizeClassName =
    variant === "link"
      ? size === "sm"
        ? "h-auto text-xs font-medium"
        : "h-auto text-sm font-medium"
      : buttonSizeClassName[size];

  return twMerge(
    clsx(
      "inline-flex items-center justify-center gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40",
      buttonVariantClassName[variant],
      sizeClassName,
      loading && "cursor-not-allowed opacity-40",
    ),
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "outline",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={getButtonClassName({
          variant,
          size,
          loading,
          className,
        })}
        aria-busy={loading || undefined}
        {...props}>
        {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
        {children ? <span>{children}</span> : null}
        {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
