import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { Table, TableRow } from '../../components/TableRow';
import { UserRole, getRoleLabel } from '../../types';
import type { AnyUser } from '../../types';
import { userService } from '../../services/api';
import { Search, CheckCircle, XCircle, Download, UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { exportToCSV } from '../../utils/csvExport';

interface UserFormData {
    firstName: string;
    lastName:  string;
    email:     string;
    password:  string;
    phone:     string;
    roleId:    number;
}

const emptyForm: UserFormData = {
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    phone:     '',
    roleId:    UserRole.Student,
};

const ROLE_OPTIONS = [
    { value: UserRole.Student, label: 'Elev'     },
    { value: UserRole.Coach,   label: 'Antrenor' },
    { value: UserRole.Admin,   label: 'Admin'    },
] as const;

export const UsersManagement: React.FC = () => {
    const [users,       setUsers]       = useState<AnyUser[]>([]);
    const [isLoading,   setIsLoading]   = useState(true);
    const [filterRole,  setFilterRole]  = useState<'all' | UserRole>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Create / Edit modal
    const [modalOpen,  setModalOpen]  = useState(false);
    const [editingId,  setEditingId]  = useState<string | null>(null);
    const [form,       setForm]       = useState<UserFormData>(emptyForm);
    const [formError,  setFormError]  = useState('');
    const [isSaving,   setIsSaving]   = useState(false);

    // Delete confirm modal
    const [deleteId,   setDeleteId]   = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            setUsers(await userService.getAll());
        } catch {
            console.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────

    const openCreate = () => {
        setForm(emptyForm);
        setEditingId(null);
        setFormError('');
        setModalOpen(true);
    };

    const openEdit = (u: AnyUser) => {
        const parts = u.name.trim().split(' ');
        setForm({
            firstName: parts[0] ?? '',
            lastName:  parts.slice(1).join(' ') ?? '',
            email:     u.email,
            password:  '',
            phone:     '',
            roleId:    u.role,
        });
        setEditingId(u.id);
        setFormError('');
        setModalOpen(true);
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
            setFormError('Prenume, Nume și Email sunt obligatorii.');
            return;
        }
        if (!editingId && !form.password.trim()) {
            setFormError('Parola este obligatorie pentru un cont nou.');
            return;
        }
        setFormError('');
        setIsSaving(true);
        try {
            if (editingId) {
                const dto: Parameters<typeof userService.update>[1] = {
                    firstName: form.firstName,
                    lastName:  form.lastName,
                    email:     form.email,
                    phone:     form.phone || undefined,
                    roleId:    form.roleId,
                };
                if (form.password.trim()) dto.password = form.password;
                await userService.update(editingId, dto);
            } else {
                await userService.create({
                    firstName: form.firstName,
                    lastName:  form.lastName,
                    email:     form.email,
                    password:  form.password,
                    phone:     form.phone || undefined,
                    roleId:    form.roleId,
                });
            }
            setModalOpen(false);
            await loadUsers();
        } catch (err: any) {
            setFormError(err?.response?.data?.message ?? 'Eroare la salvare. Verificați datele.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await userService.delete(deleteId);
            setUsers(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null);
        } catch {
            alert('Eroare la ștergere.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusToggle = async (u: AnyUser) => {
        const status    = (u as any).status ?? 'Active';
        const newStatus = status === 'Active' ? 'Inactive' : 'Active';
        try {
            await userService.updateStatus(u.id, newStatus as 'Active' | 'Inactive');
            setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus } as AnyUser : x));
        } catch {
            alert('Eroare la actualizarea statusului.');
        }
    };

    // ── Filtered list ─────────────────────────────────────────────────────────

    const filtered = users
        .filter(u => filterRole === 'all' || u.role === filterRole)
        .filter(u => {
            const q = searchQuery.trim().toLowerCase();
            return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        });

    // ── Input helper ──────────────────────────────────────────────────────────

    const inputCls = "w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-host-cyan outline-none";

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>USER <span className="text-host-cyan">MANAGEMENT</span></>}
                subtitle="Gestionează autentificarea, rolurile și statusul conturilor."
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <Card className="p-0 overflow-hidden shadow-xl border-t-4 border-t-host-cyan">

                    {/* ── Toolbar ───────────────────────────────────────────── */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
                        {/* Role filters */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', UserRole.Student, UserRole.Coach, UserRole.Admin] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFilterRole(role)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase transition-colors ${
                                        filterRole === role
                                            ? 'bg-host-cyan text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {role === 'all' ? 'Toți' : getRoleLabel(role)}
                                </button>
                            ))}
                        </div>

                        {/* Search + actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Caută utilizatori..."
                                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-1 focus:ring-host-cyan outline-none text-sm"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            </div>
                            <button
                                onClick={() => exportToCSV(
                                    filtered.map(u => ({
                                        ID:      u.id,
                                        Prenume: u.name.split(' ')[0] ?? '',
                                        Nume:    u.name.split(' ').slice(1).join(' ') ?? '',
                                        Email:   u.email,
                                        Rol:     getRoleLabel(u.role),
                                        Status:  (u as any).status ?? 'Active',
                                    })),
                                    `utilizatori_${filterRole}`
                                )}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all"
                            >
                                <Download size={15} /> Export CSV
                            </button>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-host-cyan hover:bg-cyan-600 text-white text-sm font-bold transition-all shadow-md"
                            >
                                <UserPlus size={15} /> Adaugă Utilizator
                            </button>
                        </div>
                    </div>

                    {/* ── Table ─────────────────────────────────────────────── */}
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Se încarcă...</div>
                    ) : (
                        <Table headers={['Utilizator', 'Rol', 'Email', 'Status', 'Acțiuni']}>
                            {filtered.map(u => {
                                const status = (u as any).status ?? 'Active';
                                return (
                                    <TableRow key={u.id}>
                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{u.name}</div>
                                                    <div className="text-xs text-gray-400">ID: {u.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                                                u.role === UserRole.Admin ? 'bg-purple-100 text-purple-800' :
                                                u.role === UserRole.Coach ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-green-100 text-green-800'
                                            }`}>
                                                {getRoleLabel(u.role)}
                                            </span>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {status === 'Inactive'
                                                ? <span className="text-red-500 flex items-center text-sm font-bold"><XCircle className="w-4 h-4 mr-1" />Inactiv</span>
                                                : <span className="text-green-500 flex items-center text-sm font-bold"><CheckCircle className="w-4 h-4 mr-1" />Activ</span>
                                            }
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusToggle(u)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                                        status === 'Active'
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                                >
                                                    {status === 'Active' ? 'Dezactivează' : 'Activează'}
                                                </button>
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="Editează"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(u.id)}
                                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    title="Șterge"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </TableRow>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Nu există utilizatori care să corespundă filtrului.
                                    </td>
                                </tr>
                            )}
                        </Table>
                    )}
                </Card>
            </div>

            {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                {editingId ? 'Editează Utilizator' : 'Adaugă Utilizator Nou'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Prenume *</label>
                                    <input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Nume *</label>
                                    <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className={inputCls} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    {editingId ? 'Parolă nouă (lasă gol pentru a nu schimba)' : 'Parolă *'}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    className={inputCls}
                                    placeholder={editingId ? '••••••••' : ''}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Telefon</label>
                                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+373 ..." />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Rol *</label>
                                <select value={form.roleId} onChange={e => setForm(f => ({ ...f, roleId: Number(e.target.value) }))} className={inputCls}>
                                    {ROLE_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            {formError && (
                                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 pb-6">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Anulează
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-2 rounded-lg text-sm font-bold bg-host-cyan text-white hover:bg-cyan-600 disabled:opacity-60 transition-colors"
                            >
                                {isSaving ? 'Se salvează...' : editingId ? 'Salvează' : 'Creează Cont'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ──────────────────────────────────────────── */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Confirmare Ștergere</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Ești sigur că vrei să ștergi definitiv acest cont? Acțiunea nu poate fi anulată.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Anulează
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-5 py-2 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
                            >
                                {isDeleting ? 'Se șterge...' : 'Șterge'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
