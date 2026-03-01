import React from "react";
import { cn } from "@/lib/utils";
import { getTechColor } from "@/config/techColors";

interface TechTagProps {
  name: string;
  icon?: React.ReactNode;
  expandable?: boolean;
  onExpand?: () => void;
  className?: string;
}

export function TechTag({
  name,
  icon,
  expandable = false,
  onExpand,
  className,
}: TechTagProps) {
  const colors = getTechColor(name);
  const Comp = expandable ? "button" : "span";
  const interactiveProps = expandable
    ? { type: "button" as const, onClick: onExpand }
    : {};

  return (
    <Comp
      {...interactiveProps}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
        "hover:shadow-sm",
        className,
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {icon}
      <span className="relative">
        {name}
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100" />
      </span>
    </Comp>
  );
}
