import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("theme-section-balanced", className)}
      style={props.style}
      {...props}
    >
      {children}
    </section>
  );
}
