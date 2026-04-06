import React, { type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual variant:
     * - `primary`   — gradient CTA (blue→cyan), white text, soft glow
     * - `tab`       — minimal flat tab for navigation
     * - `ghost`     — transparent with subtle border for secondary actions
     * - `secondary` — neutral surface button
     * - `danger`    — destructive action
     */
    variant?: 'primary' | 'tab' | 'ghost' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    /** Only relevant for variant="tab" */
    active?: boolean;
    /** Make the button take full width */
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    active = false,
    fullWidth = false,
    children,
    disabled,
    ...props
}) => {
    /* ─── shared base ─── */
    const baseStyles = clsx(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:pointer-events-none',
        fullWidth && 'w-full',
    );

    /* ─── variant styles ─── */
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
        /* ── Primary CTA ── */
        primary: clsx(
            'bg-gradient-to-r from-sky-500 to-cyan-400',
            'text-white font-bold tracking-wide',
            'rounded-lg',
            'shadow-[0_2px_12px_rgba(14,165,233,0.35)]',
            'hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(14,165,233,0.5)]',
            'active:translate-y-0 active:shadow-[0_1px_6px_rgba(14,165,233,0.3)]',
        ),

        /* ── Tab (navigation) ── */
        tab: clsx(
            'rounded-lg',
            'tracking-wide text-sm',
            active
                ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                : [
                    'text-gray-400',
                    'hover:text-gray-200 hover:bg-white/[0.05]',
                ],
        ),

        /* ── Ghost (secondary actions) ── */
        ghost: clsx(
            'rounded-lg',
            'bg-transparent',
            'border border-gray-600/50',
            'text-gray-300',
            'hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/[0.06]',
            'hover:shadow-[0_0_12px_rgba(34,211,238,0.10)]',
            'active:bg-cyan-400/10',
        ),

        /* ── Secondary (neutral) ── */
        secondary: clsx(
            'rounded-lg',
            'bg-gray-800 text-gray-200',
            'border border-gray-700',
            'hover:bg-gray-700 hover:border-gray-600',
            'active:bg-gray-800',
        ),

        /* ── Danger ── */
        danger: clsx(
            'rounded-lg',
            'bg-red-600 text-white',
            'hover:bg-red-500',
            'active:bg-red-700',
            'shadow-[0_2px_8px_rgba(220,38,38,0.3)]',
        ),
    };

    /* ─── sizes ─── */
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
        sm: 'h-8 px-3.5 text-xs gap-1.5',
        md: 'h-10 px-5 text-sm gap-2',
        lg: 'h-12 px-7 text-base gap-2.5',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};
