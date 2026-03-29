"use client";

import Link, { type LinkProps } from "next/link";
import {
  type AnchorHTMLAttributes,
  type PropsWithChildren,
  useCallback,
  useState,
} from "react";

type IntentLinkProps = PropsWithChildren<
  LinkProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
      preloadOnIntent?: boolean;
    }
>;

export function IntentLink({
  children,
  preloadOnIntent = true,
  onMouseEnter,
  onFocus,
  onTouchStart,
  prefetch,
  ...props
}: IntentLinkProps) {
  const [hasIntent, setHasIntent] = useState(false);

  const activateIntent = useCallback(() => {
    if (!preloadOnIntent || hasIntent) return;
    setHasIntent(true);
  }, [hasIntent, preloadOnIntent]);

  return (
    <Link
      {...props}
      prefetch={
        preloadOnIntent ? (hasIntent ? null : false) : prefetch
      }
      onMouseEnter={(event) => {
        activateIntent();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        activateIntent();
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        activateIntent();
        onTouchStart?.(event);
      }}
    >
      {children}
    </Link>
  );
}
