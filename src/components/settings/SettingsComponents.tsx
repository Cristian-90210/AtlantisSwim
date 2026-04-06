import React from 'react';
import type { LucideIcon } from 'lucide-react';

/* ─── Toggle Switch ─────────────────────────────────────────── */

interface SettingsToggleProps {
    id: string;
    checked: boolean;
    onChange: () => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ id, checked, onChange }) => (
    <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`
            relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer items-center rounded-full
            border-2 border-transparent transition-all duration-300 ease-in-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-host-cyan focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-gray-800
            ${checked
                ? 'bg-host-cyan shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                : 'bg-gray-300 dark:bg-gray-600'
            }
        `}
    >
        <span
            className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white
                shadow-lg ring-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${checked ? 'translate-x-5' : 'translate-x-0.5'}
            `}
        />
    </button>
);

/* ─── Section Card ──────────────────────────────────────────── */

interface SettingsSectionProps {
    icon: LucideIcon;
    iconBg: string;        // e.g. "bg-blue-100 dark:bg-blue-900/30"
    iconColor: string;     // e.g. "text-blue-500"
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    description,
    children,
}) => (
    <section className="group/section bg-white dark:bg-gray-800/80 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/60 overflow-hidden backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-200/70 dark:hover:shadow-black/30">
        {/* Section Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover/section:scale-105`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-white tracking-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
        {/* Section Content */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {children}
        </div>
    </section>
);

/* ─── Toggle Row ────────────────────────────────────────────── */

interface SettingsToggleItemProps {
    id: string;
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
    icon?: LucideIcon;
    iconColor?: string;
}

export const SettingsToggleItem: React.FC<SettingsToggleItemProps> = ({
    id,
    title,
    description,
    checked,
    onChange,
    icon: Icon,
    iconColor,
}) => (
    <div className="group/item flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 cursor-pointer"
         onClick={onChange}
         role="button"
         tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(); } }}
    >
        <div className="flex items-center gap-3 min-w-0">
            {Icon && (
                <Icon
                    size={16}
                    strokeWidth={2}
                    className={`flex-shrink-0 transition-colors duration-200 ${iconColor ?? 'text-gray-400 dark:text-gray-500'}`}
                />
            )}
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">
                    {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
            <SettingsToggle id={id} checked={checked} onChange={onChange} />
        </div>
    </div>
);

/* ─── Select Row ────────────────────────────────────────────── */

interface SettingsSelectItemProps {
    id: string;
    title: string;
    description: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export const SettingsSelectItem: React.FC<SettingsSelectItemProps> = ({
    id,
    title,
    description,
    value,
    onChange,
    options,
}) => (
    <div className="px-6 py-5 transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">
                    {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {description}
                </p>
            </div>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    w-full sm:w-56 px-4 py-2.5 rounded-xl
                    border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-sm font-medium text-gray-800 dark:text-white
                    shadow-sm
                    cursor-pointer appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                    bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10
                    transition-all duration-200
                    hover:border-host-cyan/50
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-host-cyan focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-gray-800
                "
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);
