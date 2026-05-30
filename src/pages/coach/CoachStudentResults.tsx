import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { Trophy, TrendingUp, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { resultsService, studentService } from '../../services/api';
import type { SwimmingResult, Student } from '../../types';

export const CoachStudentResults: React.FC = () => {
    const { user } = useAuth();
    const coachId = user?.id ?? '';

    const [allResults, setAllResults] = useState<SwimmingResult[]>([]);
    const [students, setStudents]     = useState<Student[]>([]);

    useEffect(() => {
        resultsService.getAll().then(r => setAllResults(r.filter(res => res.coachId === coachId)));
        studentService.getAll().then(setStudents);
    }, [coachId]);

    const parseTime = (timeStr: string): number => {
        const parts = timeStr.split(':');
        const minutes = parseInt(parts[0], 10);
        const seconds = parseFloat(parts[1]);
        return minutes * 60 + seconds;
    };

    // Group by student
    const groupedByStudent = useMemo(() => {
        const groups: Record<string, SwimmingResult[]> = {};
        allResults.forEach(r => {
            if (!groups[r.studentId]) groups[r.studentId] = [];
            groups[r.studentId].push(r);
        });
        return groups;
    }, [allResults]);

    const styleConfig: Record<string, { color: string; bg: string }> = {
        freestyle: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
        backstroke: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
        butterfly: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
        breaststroke: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    };

    const uniqueStudents = Object.keys(groupedByStudent).length;
    const uniqueStyles = [...new Set(allResults.map(r => r.style))].length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <PageHeader title="Student Results" subtitle="Track and review your students' swimming performance" />

            <div className="container mx-auto px-6 mt-10 relative z-20 max-w-5xl space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-host-cyan/10 rounded-full text-host-cyan"><Trophy size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Results</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{allResults.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-500"><Activity size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Students Tracked</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{uniqueStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-host-blue to-blue-600 p-6 rounded-2xl shadow-xl text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full"><TrendingUp size={24} /></div>
                            <div>
                                <p className="text-sm opacity-80">Styles Covered</p>
                                <p className="text-2xl font-bold">{uniqueStyles}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results by Student */}
                {Object.entries(groupedByStudent).map(([studentId, results]) => {
                    const student = students.find(s => s.id === studentId);
                    return (
                        <div key={studentId}>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                                <img
                                    src={student?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'S')}`}
                                    alt={student?.name}
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-host-cyan/20"
                                />
                                {student?.name ?? studentId}
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">{student?.level}</span>
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 font-semibold">Date</th>
                                                <th className="p-4 font-semibold">Style</th>
                                                <th className="p-4 font-semibold">Distance</th>
                                                <th className="p-4 font-semibold">Time</th>
                                                <th className="p-4 font-semibold">Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {results
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .map(r => {
                                                    const sc = styleConfig[r.style] ?? styleConfig.freestyle;
                                                    // Find best time for this style+distance in this student's results
                                                    const bestForStyle = results
                                                        .filter(x => x.style === r.style && x.distance === r.distance)
                                                        .reduce((best, x) => parseTime(x.time) < parseTime(best.time) ? x : best, r);
                                                    const isBest = bestForStyle.id === r.id;
                                                    const pct = Math.min(100, Math.round((parseTime(bestForStyle.time) / parseTime(r.time)) * 100));

                                                    return (
                                                        <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                            <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{r.date}</td>
                                                            <td className="p-4">
                                                                <span className={clsx('inline-block px-2.5 py-1 rounded-full text-xs font-bold border capitalize', sc.bg, sc.color)}>
                                                                    {r.style}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 font-bold text-gray-800 dark:text-white">{r.distance}</td>
                                                            <td className="p-4">
                                                                <span className={clsx("font-bold", isBest ? "text-amber-400" : "text-host-cyan")}>
                                                                    {r.time}
                                                                    {isBest && <Trophy className="inline ml-1 w-3.5 h-3.5 text-amber-400" />}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                    <div
                                                                        className={clsx("h-2 rounded-full", pct === 100 ? "bg-amber-400" : "bg-gradient-to-r from-host-blue to-host-cyan")}
                                                                        style={{ width: `${pct}%` }}
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
                        </div>
                    );
                })}

                {allResults.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <Trophy className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={40} />
                        <p className="text-gray-500 dark:text-gray-400">No student results recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
