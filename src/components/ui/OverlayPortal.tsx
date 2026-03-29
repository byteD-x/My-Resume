"use client";

import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export function OverlayPortal({ children }: PropsWithChildren) {
  if (typeof document === "undefined") {
    return <>{children}</>;
  }

  return createPortal(children, document.body);
}
