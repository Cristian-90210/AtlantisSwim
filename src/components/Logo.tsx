import React from 'react';
import { clsx } from 'clsx';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    stacked?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
    className,
    iconClassName,
    textClassName,
    titleClassName,
    subtitleClassName,
    stacked = false,
}) => {
    return (
        <div className={clsx('flex items-center gap-3', stacked && 'flex-col items-start gap-2', className)}>
            <img
                src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png"
                alt="Atlantis SwimSchool"
                className={clsx('h-10 w-10 object-contain', iconClassName)}
            />

            <div className={clsx('flex items-baseline gap-2 leading-none', stacked && 'flex-col items-start gap-1', textClassName)}>
                <span className={clsx('text-2xl font-extrabold uppercase tracking-wider text-gray-900 dark:text-white', titleClassName)}>
                    ATLANTIS
                </span>
                <span className={clsx('text-2xl font-extrabold uppercase tracking-wider text-host-cyan', subtitleClassName)}>
                    SWIMSCHOOL
                </span>
            </div>
        </div>
    );
};
