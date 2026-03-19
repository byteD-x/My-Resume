"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogCloseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  ariaLabel: string;
  iconSize?: number;
}

export const DialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  DialogCloseButtonProps
>(function DialogCloseButton(
  { ariaLabel, className, iconSize = 18, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn("theme-dialog-close motion-chip", className)}
      {...props}
    >
      <X size={iconSize} className="motion-icon-float" />
    </button>
  );
});
