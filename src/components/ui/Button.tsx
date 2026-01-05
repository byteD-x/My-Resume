import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps<T extends React.ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'color'>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  tertiary: 'btn btn-tertiary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-2.5',
  lg: 'text-base px-8 py-3',
};

export function Button<T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  const isButton = Component === 'button';

  return (
    <Component
      {...(isButton ? { type: 'button' } : {})}
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}
