import React, { type ButtonHTMLAttributes } from 'react';
import { Button } from './Button';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Legacy CTA Button — now a thin wrapper around the unified Button component.
 * Delegates to `<Button variant="primary" />` with sensible defaults.
 *
 * Prefer using `<Button variant="primary" />` directly in new code.
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
    children,
    fullWidth = true,
    className = '',
    ...props
}) => {
    return (
        <Button
            variant="primary"
            size="lg"
            fullWidth={fullWidth}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
};
