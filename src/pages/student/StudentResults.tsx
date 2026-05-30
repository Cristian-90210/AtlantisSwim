import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resultsService, coachService } from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { Trophy, TrendingUp, Timer, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import type { SwimmingResult, Coach } from '../../types';

export const StudentResults: React.FC = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<SwimmingResult[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);

    useEffect(() => {
        coachService.getAll().then(setCoaches);
        if (user) {
            resultsService.getByStudent(user.id).then(setResults);
        }
    }, [user]);

    // Parse time string "00:35.20" into seconds for comparison
    const parseTime = (timeStr: string): number => {
        const parts = timeStr.split(':');
        const minutes = parseInt(parts[0], 10);
        const seconds = parseFloat(parts[1]);
        return minutes * 60 + seconds;
    };

    // Group results by style
    const groupedByStyle = useMemo(() => {
        const groups: Record<string, SwimmingResult[]> = {};
        results.forEach(r => {
            if (!groups[r.style]) groups[r.style] = [];
            groups[r.style].push(r);
        });
        // Sort within each group by date
        Object.values(groups).forEach(arr => arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        return groups;
    }, [results]);

    // Best result per style
    const bestResults = useMemo(() => {
        const bests: Record<string, SwimmingResult> = {};
        results.forEach(r => {
            const current = bests[r.style];
            if (!current || parseTime(r.time) < parseTime(current.time)) {
                bests[r.style] = r;
            }
        });
        return bests;
    }, [results]);

    const styleConfig: Record<string, { color: string; bg: string }> = {
        freestyle: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
        backstroke: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
        butterfly: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
        breaststroke: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    };

    const getCoachName = (coachId: string) => {
        return coaches.find(c => c.id === coachId)?.name ?? '—';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Results" subtitle="Track your swimming performance and progress" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-5xl space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Results</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{results.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-500">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Styles Practiced</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{Object.keys(groupedByStyle).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-host-blue to-blue-600 p-6 rounded-2xl shadow-xl text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm opacity-80">Best Time</p>
                                <p className="text-2xl font-bold">
                                    {results.length > 0
                                        ? results.reduce((best, r) => parseTime(r.time) < parseTime(best.time) ? r : best).time
                                        : '—'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Bests */}
                {Object.keys(bestResults).length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Trophy className="text-amber-400" size={20} />
                            Personal Bests
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(bestResults).map(([style, result]) => {
                                const sc = styleConfig[style] ?? styleConfig.freestyle;
                                return (
                                    <div key={style} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-full border ${sc.bg}`}>
                                                <Timer size={18} className={sc.color} />
                                            </div>
                                            <div>
                                                <span className={`text-xs font-bold uppercase tracking-wider capitalize ${sc.color}`}>{style}</span>
                                                <p className="text-xs text-gray-400 mt-0.5">{result.distance} · {result.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-extrabold text-host-cyan">{result.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Full Results Table */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="text-host-cyan" size={20} />
                        All Results
                    </h2>
                    {results.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 font-semibold">Date</th>
                                            <th className="p-4 font-semibold">Style</th>
                                            <th className="p-4 font-semibold">Distance</th>
                                            <th className="p-4 font-semibold">Time</th>
                                            <th className="p-4 font-semibold">Coach</th>
                                            <th className="p-4 font-semibold">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {results
                                            .slice()
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map(r => {
                                                const sc = styleConfig[r.style] ?? styleConfig.freestyle;
                                                // Check if this is the best result for its style
                                                const isBest = bestResults[r.style]?.id === r.id;
                                                // Calculate progress relative to best in same style
                                                const best = bestResults[r.style];
                                                const progressPct = best
                                                    ? Math.min(100, Math.round((parseTime(best.time) / parseTime(r.time)) * 100))
                                                    : 100;

                                                return (
                                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                        <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{r.date}</td>
                                                        <td className="p-4">
                                                            <span className={clsx(
                                                                'inline-block px-2.5 py-1 rounded-full text-xs font-bold border capitalize',
                                                                sc.bg, sc.color
                                                            )}>
                                                                {r.style}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-bold text-gray-800 dark:text-white">{r.distance}</td>
                                                        <td className="p-4">
                                                            <span className={clsx(
                                                                "font-bold",
                                                                isBest ? "text-amber-400" : "text-host-cyan"
                                                            )}>
                                                                {r.time}
                                                                {isBest && <Trophy className="inline ml-1 w-3.5 h-3.5 text-amber-400" />}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{getCoachName(r.coachId)}</td>
                                                        <td className="p-4">
                                                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className={clsx(
                                                                        "h-2 rounded-full transition-all duration-500",
                                                                        progressPct === 100
                                                                            ? "bg-amber-400"
                                                                            : "bg-gradient-to-r from-host-blue to-host-cyan"
                                                                    )}
                                                                    style={{ width: `${progressPct}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <Trophy className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                            <p className="text-gray-500 dark:text-gray-400">No results recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
