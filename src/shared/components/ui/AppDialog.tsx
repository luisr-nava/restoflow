"use client";

import type { ReactNode } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import clsx from "clsx";
import { X } from "lucide-react";
import { Button } from "./Button";

type AppDialogSize = "sm" | "md" | "lg" | "xl" | "2xl";

type AppDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: AppDialogSize;
  showCloseButton?: boolean;
  className?: string;
  panelClassName?: string;
};

const sizeClassNameBySize: Record<AppDialogSize, string> = {
  "sm": "max-w-sm",
  "md": "max-w-md",
  "lg": "max-w-lg",
  "xl": "max-w-xl",
  "2xl": "max-w-2xl",
};

export function AppDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  className,
  panelClassName,
}: AppDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={clsx("relative z-50", className)}>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            className={clsx(
              "w-full rounded-2xl border border-border bg-gray-100 p-6 shadow-xl",
              "max-h-[calc(100vh-2rem)] overflow-y-auto",
              sizeClassNameBySize[size],
              panelClassName,
            )}>
            {(title || description || showCloseButton) && (
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <DialogTitle className="text-lg font-semibold text-foreground">
                      {title}
                    </DialogTitle>
                  )}

                  {description && (
                    <Description className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </Description>
                  )}
                </div>

                {showCloseButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:text-foreground">
                    <X size={16}/>
                  </Button>
                )}
              </div>
            )}

            <div>{children}</div>

            {footer && (
              <div className="mt-6 flex justify-end gap-2">{footer}</div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

