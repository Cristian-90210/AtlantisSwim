import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { Table, TableRow } from '../../components/TableRow';
import { courseService } from '../../services/api';
import { Plus, Edit2, Trash2, X, Save, BookOpen } from 'lucide-react';

interface CourseRow {
    id: number;
    name: string;
    description: string;
    price: number;
    capacity: number;
    enrolled: number;
    schedule: string;
    levelId: number;
    levelName: string;
}

interface Level { id: number; name: string; }

const EMPTY_FORM = { name: '', description: '', price: 0, capacity: 20, schedule: '', levelId: 1 };

export const AdminCourses: React.FC = () => {
    const [courses, setCourses]     = useState<CourseRow[]>([]);
    const [levels, setLevels]       = useState<Level[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm]           = useState(EMPTY_FORM);
    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [rawCourses, rawLevels] = await Promise.all([
                courseService.getAll(),
                courseService.getLevels(),
            ]);
            setLevels(rawLevels);
            setCourses(rawCourses.map((c: any) => ({
                id:        Number(c.id),
                name:      c.title,
                description: c.description,
                price:     c.price,
                capacity:  c.capacity,
                enrolled:  c.enrolled,
                schedule:  c.schedule,
                levelId:   rawLevels.find((l: Level) => l.name === c.level)?.id ?? 1,
                levelName: c.level,
            })));
        } catch (e) {
            setError('Eroare la încărcare cursuri.');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreate = () => {
        setForm({ ...EMPTY_FORM, levelId: levels[0]?.id ?? 1 });
        setEditingId(null);
        setShowForm(true);
        setError('');
    };

    const openEdit = (c: CourseRow) => {
        setForm({ name: c.name, description: c.description, price: c.price, capacity: c.capacity, schedule: c.schedule, levelId: c.levelId });
        setEditingId(c.id);
        setShowForm(true);
        setError('');
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setError('Numele cursului este obligatoriu.'); return; }
        setSaving(true);
        setError('');
        try {
            if (editingId !== null) {
                await courseService.update(editingId, form);
            } else {
                await courseService.create(form);
            }
            setShowForm(false);
            await loadData();
        } catch {
            setError('Eroare la salvare. Verifică că backend-ul este pornit.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Ștergi cursul "${name}"?`)) return;
        try {
            await courseService.delete(id);
            await loadData();
        } catch {
            alert('Eroare la ștergere.');
        }
    };

    const levelColor = (name: string) => {
        if (name === 'Advanced')     return 'bg-purple-100 text-purple-800';
        if (name === 'Intermediate') return 'bg-blue-100 text-blue-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>GESTIONARE <span className="text-host-cyan">CURSURI</span></>}
                subtitle="Adaugă, editează și șterge cursuri din programa școlii."
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                {/* Error banner */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">{error}</div>
                )}

                {/* Add Course Form */}
                {showForm && (
                    <Card className="mb-6 p-6 border-t-4 border-t-host-cyan">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                {editingId !== null ? 'Editează Curs' : 'Adaugă Curs Nou'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Denumire curs *</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="ex: Înot pentru copii"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nivel</label>
                                <select
                                    value={form.levelId}
                                    onChange={e => setForm(p => ({ ...p, levelId: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                >
                                    {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descriere</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    rows={3}
                                    placeholder="Descriere detaliată a cursului..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Preț (MDL)</label>
                                <input
                                    type="number" min={0}
                                    value={form.price}
                                    onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Capacitate (locuri)</label>
                                <input
                                    type="number" min={1}
                                    value={form.capacity}
                                    onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Orar</label>
                                <input
                                    value={form.schedule}
                                    onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))}
                                    placeholder="ex: Lun, Mie 10:00"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                        <div className="flex gap-3 mt-5">
                            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                                <Save size={15} /> {saving ? 'Se salvează...' : 'Salvează'}
                            </Button>
                            <Button onClick={() => setShowForm(false)} variant="secondary">Anulează</Button>
                        </div>
                    </Card>
                )}

                <Card className="p-0 overflow-hidden shadow-xl border-t-4 border-t-host-cyan">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <BookOpen size={16} className="text-host-cyan" />
                            {isLoading ? 'Se încarcă...' : `${courses.length} cursuri`}
                        </span>
                        <Button onClick={openCreate} className="flex items-center gap-2 text-sm">
                            <Plus size={15} /> Adaugă curs
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Se încarcă cursurile...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <BookOpen className="mx-auto mb-3 text-gray-300" size={40} />
                            <p>Niciun curs găsit. Adaugă primul curs!</p>
                        </div>
                    ) : (
                        <Table headers={['Curs', 'Nivel', 'Preț', 'Locuri', 'Orar', 'Acțiuni']}>
                            {courses.map(c => (
                                <TableRow key={c.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-800 dark:text-gray-200">{c.name}</div>
                                        <div className="text-xs text-gray-400 max-w-xs truncate">{c.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold uppercase ${levelColor(c.levelName)}`}>
                                            {c.levelName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">{c.price} MDL</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{c.enrolled}</span>
                                        <span className="text-gray-400">/{c.capacity}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{c.schedule || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(c)}
                                                className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                title="Editează"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id, c.name)}
                                                className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                title="Șterge"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    );
};
