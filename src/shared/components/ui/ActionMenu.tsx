"use client";

import type { ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";
import { MoreHorizontal } from "lucide-react";

type ActionMenuProps = {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
  itemsClassName?: string;
};

type ActionMenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  icon?: ReactNode;
};

export function ActionMenu({
  children,
  ariaLabel = "Abrir menú de acciones",
  className,
  itemsClassName,
}: ActionMenuProps) {
  return (
    <Menu as="div" className={clsx("relative inline-block text-left", className)}>
      <MenuButton
        aria-label={ariaLabel}
        className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
        <MoreHorizontal className="size-4" />
      </MenuButton>

      <MenuItems
        transition
        className={clsx(
          "absolute right-0 z-40 mt-2 min-w-40 origin-top-right rounded-xl border border-border bg-background p-1 shadow-xl outline-none",
          "data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:transition data-[leave]:transition",
          itemsClassName,
        )}>
        {children}
      </MenuItems>
    </Menu>
  );
}

export function ActionMenuItem({
  children,
  onClick,
  disabled = false,
  tone = "default",
  icon,
}: ActionMenuItemProps) {
  return (
    <MenuItem disabled={disabled}>
      {({ close, focus, disabled: itemDisabled }) => (
        <button
          type="button"
          disabled={itemDisabled}
          onClick={() => {
            if (itemDisabled) {
              return;
            }

            close();
            onClick?.();
          }}
          className={clsx(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
            focus && "bg-muted",
            itemDisabled && "cursor-not-allowed opacity-40",
            tone === "danger" ? "text-destructive" : "text-foreground",
          )}>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </button>
      )}
    </MenuItem>
  );
}
