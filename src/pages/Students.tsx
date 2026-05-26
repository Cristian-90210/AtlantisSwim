import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { CTAButton } from '../components/CTAButton';
import { PageHeader } from '../components/PageHeader';
import { Table, TableRow } from '../components/TableRow';
import { UserRole } from '../types';
import type { Student } from '../types';
import { studentService } from '../services/api';
import { Trash2, Plus, X, Search, Edit2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Students: React.FC = () => {
    const { isAdmin } = useAuth();
    const { t } = useTranslation();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const data = await studentService.getAll();
            setStudents(data);
        } catch (error) {
            console.error('Failed to load students', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '' as number | string,
        level: 'Beginner' as Student['level'],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (student: Student) => {
        setFormData({
            name: student.name,
            email: student.email,
            age: student.age,
            level: student.level,
        });
        setEditingId(student.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.age) {
            alert('Please fill in all fields');
            return;
        }

        try {
            if (editingId) {
                // Update existing
                await studentService.update(editingId, {
                    name: formData.name,
                    email: formData.email,
                    age: Number(formData.age),
                    level: formData.level,
                });
            } else {
                // Create new
                const newStudent: Student = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: formData.name,
                    email: formData.email,
                    age: Number(formData.age),
                    level: formData.level,
                    status: 'Active',
                    role: UserRole.Student
                };
                await studentService.create(newStudent);
            }
            await loadStudents(); // Reload list
            resetForm();
            setSuccessMsg(editingId ? 'Student updated successfully!' : 'Student enrolled successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save student');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.delete(id);
                setStudents(prev => prev.filter(s => s.id !== id)); // Optimistic update
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', age: '', level: 'Beginner' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            <PageHeader
                title={<>{t('students_page.title')} <span className="text-host-cyan">{t('students_page.title_highlight')}</span></>}
                subtitle={t('students_page.subtitle')}
            />

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                {/* Success Message */}
                {successMsg && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 text-sm font-medium animate-in slide-in-from-top-4 duration-300 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        {successMsg}
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <input type="text" placeholder={t('hero.search_placeholder')} className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:border-host-cyan focus:ring-1 focus:ring-host-cyan outline-none text-sm transition-all" />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="mt-4 md:mt-0 w-full md:w-auto flex justify-end">
                            <CTAButton fullWidth={false} onClick={() => { resetForm(); setShowForm(!showForm); }}>
                                {showForm ? <><X className="w-4 h-4 mr-2" /> {t('enrollment_modal.cancel')}</> : <><Plus className="w-4 h-4 mr-2" /> Add Student</>}
                            </CTAButton>
                        </div>
                    )}
                </div>

                {/* Form */}
                {showForm && isAdmin && (
                    <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-host-cyan/20">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">
                                    {editingId ? 'Edit Student' : 'New Enrollment'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('students_page.age')}</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            placeholder="18"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('students_page.level')}</label>
                                        <select
                                            name="level"
                                            value={formData.level}
                                            onChange={handleInputChange}
                                            className="w-full rounded border-gray-300 p-2 text-sm focus:border-host-cyan outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                        >
                                            <option value="Beginner">{t('hero.levels.beginner')}</option>
                                            <option value="Intermediate">{t('hero.levels.intermediate')}</option>
                                            <option value="Advanced">{t('hero.levels.advanced')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <CTAButton type="submit" fullWidth={false}>
                                        {editingId ? 'Update Student' : 'Save Enrollment'}
                                    </CTAButton>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}

                <Card className="p-0 overflow-hidden shadow-xl border-t-4 border-t-host-cyan">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading students...</div>
                    ) : (
                        <Table headers={['Name', t('students_page.age'), 'Email', t('students_page.level'), 'Status', ...(isAdmin ? ['Actions'] : [])]}>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <td className="px-6 py-4 font-bold text-host-blue dark:text-white">{student.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.age}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                            ${student.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                                                student.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'}`}>
                                            {student.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                            ${student.status === 'Active' ? 'bg-cyan-50 text-host-cyan border border-cyan-100' : 'bg-red-100 text-red-600'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="text-gray-300 hover:text-host-cyan transition-colors p-1 rounded hover:bg-cyan-50"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="text-gray-300 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </TableRow>
                            ))}
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    );
};
