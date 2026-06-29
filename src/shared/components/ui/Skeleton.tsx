import type { HTMLAttributes } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx("animate-pulse rounded-md bg-surface-3"),
        className,
      )}
      {...props}
    />
  );
}
