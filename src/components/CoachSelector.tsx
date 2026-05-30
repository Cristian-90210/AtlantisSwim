import React, { useState, useEffect } from 'react';
import { coachService } from '../services/api';
import type { Coach } from '../types';
import { clsx } from 'clsx';
import { CheckCircle } from 'lucide-react';

interface CoachSelectorProps {
    selectedCoachId: string | null;
    onSelect: (coachId: string) => void;
}

export const CoachSelector: React.FC<CoachSelectorProps> = ({ selectedCoachId, onSelect }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);

    useEffect(() => {
        coachService.getAll().then(setCoaches);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4">
            {coaches.map(coach => {
                const isSelected = selectedCoachId === coach.id;
                return (
                    <div
                        key={coach.id}
                        onClick={() => onSelect(coach.id)}
                        className={clsx(
                            "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            isSelected
                                ? "border-host-cyan bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
                                : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                        )}
                    >
                        <img
                            src={coach.avatar}
                            alt={coach.name}
                            className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 dark:text-white">{coach.name}</h4>
                            <p className="text-xs text-host-blue font-medium uppercase">{coach.specialization}</p>
                        </div>
                        <div className={clsx(
                            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                            isSelected ? "bg-host-cyan border-host-cyan text-white" : "border-gray-300"
                        )}>
                            {isSelected && <CheckCircle size={14} />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
