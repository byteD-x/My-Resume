import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  tertiary: "btn btn-tertiary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-6 py-2.5",
  lg: "text-base px-8 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}
