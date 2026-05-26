import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCourses, mockCoaches, mockStudents } from '../data/mockData';
import { useTranslation } from 'react-i18next';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Custom hook: debounces a string value by `delay` ms.
 * No external dependencies — just useEffect + setTimeout.
 */
function useDebouncedValue(value: string, delay: number): string {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = React.memo(({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    /* ─── Debounce: filtering runs 300ms after the user stops typing ─── */
    const debouncedQuery = useDebouncedValue(query, 300);

    const results = useMemo(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) return { courses: [], coaches: [], students: [] };

        const lowerQuery = debouncedQuery.toLowerCase();
        return {
            courses: mockCourses.filter(c => c.title.toLowerCase().includes(lowerQuery)),
            coaches: mockCoaches.filter(c => c.name.toLowerCase().includes(lowerQuery)),
            students: mockStudents.filter(s => s.name.toLowerCase().includes(lowerQuery))
        };
    }, [debouncedQuery]);

    const hasResults = results.courses.length > 0 || results.coaches.length > 0 || results.students.length > 0;

    /* Reset query when modal closes */
    useEffect(() => {
        if (!isOpen) setQuery('');
    }, [isOpen]);

    const handleNavigate = useCallback((path: string) => {
        navigate(path);
        onClose();
        setQuery('');
    }, [navigate, onClose]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Search Box */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <Search className="w-6 h-6 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder={t('hero.search_placeholder')}
                        className="flex-1 bg-transparent text-xl outline-none text-gray-800 dark:text-white placeholder-gray-400"
                        autoFocus
                        value={query}
                        onChange={handleInputChange}
                    />
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {!query && (
                        <div className="p-8 text-center text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>{t('search.hint')}</p>
                        </div>
                    )}

                    {query && !hasResults && (
                        <div className="p-8 text-center text-gray-500">
                            {t('search.no_results', { query: debouncedQuery })}
                        </div>
                    )}

                    {hasResults && (
                        <div className="p-2">
                            {/* Courses */}
                            {results.courses.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('search.section_courses')}</h3>
                                    {results.courses.map(course => (
                                        <div
                                            key={course.id}
                                            onClick={() => handleNavigate('/courses')}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer group"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-host-cyan mr-3 group-hover:scale-125 transition-transform" />
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{course.title}</div>
                                                <div className="text-sm text-gray-500">{course.level} • ${course.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Coaches */}
                            {results.coaches.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('search.section_coaches')}</h3>
                                    {results.coaches.map(coach => (
                                        <div
                                            key={coach.id}
                                            onClick={() => handleNavigate('/coaches')}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                                        >
                                            <img src={coach.avatar} alt={coach.name} className="w-8 h-8 rounded-full mr-3 object-cover" />
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{coach.name}</div>
                                                <div className="text-sm text-gray-500">{coach.specialization}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Students */}
                            {results.students.length > 0 && (
                                <div className="mb-2">
                                    <h3 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('search.section_students')}</h3>
                                    {results.students.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => handleNavigate('/students')}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                    <span>{t('search.close_hint')}</span>
                    <span>{t('search.results_count', { count: results.courses.length + results.coaches.length + results.students.length })}</span>
                </div>
            </div>
        </div>
    );
});
