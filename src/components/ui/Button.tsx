import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-cream hover:bg-ink-soft',
  accent: 'bg-saffron-400 text-ink hover:bg-saffron-500',
  outline: 'border border-ink/30 bg-white text-ink hover:bg-cream-deep',
  ghost: 'text-ink hover:bg-cream-deep',
  danger: 'bg-terracotta-600 text-white hover:bg-terracotta-700',
};
const sizes: Record<Size, string> = {
  sm: 'min-h-[36px] px-3 text-sm',
  md: 'min-h-[44px] px-4 text-sm',
  lg: 'min-h-[48px] px-6 text-base',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', full = false) =>
  `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  loading?: boolean;
}

export function Button({ variant, size, full, loading, children, disabled, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={`${buttonClass(variant, size, full)} ${className}`} {...rest}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
}

export function ButtonLink({ variant, size, full, className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={`${buttonClass(variant, size, full)} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
