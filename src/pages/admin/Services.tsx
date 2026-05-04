import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { Table, TableRow } from '../../components/TableRow';
import {
    getSwimmingServices,
    createSwimmingService,
    updateSwimmingService,
    deleteSwimmingService,
    type SwimmingServiceDto,
} from '../../api/services/swimmingService';
import { Plus, Edit2, Trash2, X, Save, Waves } from 'lucide-react';

const EMPTY_FORM = { serviceName: '', serviceDescription: '', servicePrice: 0 };

export const AdminServices: React.FC = () => {
    const [services, setServices]   = useState<SwimmingServiceDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm]           = useState(EMPTY_FORM);
    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState('');

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = await getSwimmingServices();
            setServices(data);
        } catch {
            setError('Eroare la încărcare servicii. Verifică că backend-ul este pornit.');
        } finally {
            setIsLoading(false);
        }
    };

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
        setError('');
    };

    const openEdit = (s: SwimmingServiceDto) => {
        setForm({ serviceName: s.serviceName, serviceDescription: s.serviceDescription, servicePrice: s.servicePrice });
        setEditingId(s.id);
        setShowForm(true);
        setError('');
    };

    const handleSave = async () => {
        if (!form.serviceName.trim()) { setError('Numele serviciului este obligatoriu.'); return; }
        setSaving(true);
        setError('');
        try {
            if (editingId !== null) {
                await updateSwimmingService({ id: editingId, ...form });
            } else {
                await createSwimmingService(form);
            }
            setShowForm(false);
            await loadServices();
        } catch {
            setError('Eroare la salvare. Verifică că backend-ul este pornit.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Ștergi serviciul "${name}"?`)) return;
        try {
            await deleteSwimmingService(id);
            await loadServices();
        } catch {
            alert('Eroare la ștergere.');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>SERVICII <span className="text-host-cyan">ÎNOT</span></>}
                subtitle="Gestionează serviciile oferite de școala de înot."
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                {error && !showForm && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">{error}</div>
                )}

                {showForm && (
                    <Card className="mb-6 p-6 border-t-4 border-t-host-cyan">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                {editingId !== null ? 'Editează Serviciu' : 'Adaugă Serviciu Nou'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Denumire serviciu *</label>
                                <input
                                    value={form.serviceName}
                                    onChange={e => setForm(p => ({ ...p, serviceName: e.target.value }))}
                                    placeholder="ex: Curs de înot adulți"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Preț (MDL)</label>
                                <input
                                    type="number" min={0} step={0.01}
                                    value={form.servicePrice}
                                    onChange={e => setForm(p => ({ ...p, servicePrice: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descriere</label>
                                <textarea
                                    value={form.serviceDescription}
                                    onChange={e => setForm(p => ({ ...p, serviceDescription: e.target.value }))}
                                    rows={3}
                                    placeholder="Descriere detaliată a serviciului..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-host-cyan outline-none text-sm resize-none"
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
                            <Waves size={16} className="text-host-cyan" />
                            {isLoading ? 'Se încarcă...' : `${services.length} servicii`}
                        </span>
                        <Button onClick={openCreate} className="flex items-center gap-2 text-sm">
                            <Plus size={15} /> Adaugă serviciu
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Se încarcă serviciile...</div>
                    ) : services.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Waves className="mx-auto mb-3 text-gray-300" size={40} />
                            <p>Niciun serviciu găsit. Adaugă primul serviciu!</p>
                        </div>
                    ) : (
                        <Table headers={['Serviciu', 'Descriere', 'Preț', 'Acțiuni']}>
                            {services.map(s => (
                                <TableRow key={s.id}>
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">{s.serviceName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm">
                                        <p className="line-clamp-2">{s.serviceDescription}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                                        {Number(s.servicePrice).toFixed(2)} MDL
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(s)}
                                                className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                title="Editează"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id, s.serviceName)}
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
