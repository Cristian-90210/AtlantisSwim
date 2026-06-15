import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

// Downscale the picked image to a small square JPEG data URL so it stays well
// under the server's size cap and loads fast everywhere it's displayed.
function resizeImage(file: File, size = 256): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas not supported'));
                // Cover-crop to a centered square.
                const min = Math.min(img.width, img.height);
                const sx = (img.width - min) / 2;
                const sy = (img.height - min) / 2;
                ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = reject;
            img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const AvatarUploader: React.FC = () => {
    const { user, updateAvatar } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const display = user?.avatar
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=random`;

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // allow re-picking the same file
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Te rog alege o imagine.'); return; }
        setError('');
        setBusy(true);
        try {
            const dataUrl = await resizeImage(file);
            const saved = await userService.updateMyAvatar(dataUrl);
            updateAvatar(saved ?? undefined);
        } catch {
            setError('Nu am putut încărca imaginea. Încearcă din nou.');
        } finally {
            setBusy(false);
        }
    };

    const handleRemove = async () => {
        setError('');
        setBusy(true);
        try {
            await userService.updateMyAvatar(null);
            updateAvatar(undefined);
        } catch {
            setError('Nu am putut șterge imaginea.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
            <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                    <img
                        src={display}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-host-cyan/20"
                    />
                    {busy && (
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={22} />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white">Poză de profil</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">JPG sau PNG, redimensionată automat.</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => inputRef.current?.click()}
                            disabled={busy}
                            className="inline-flex items-center gap-2 bg-host-cyan hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                        >
                            <Camera size={16} /> Încarcă
                        </button>
                        {user?.avatar && (
                            <button
                                onClick={handleRemove}
                                disabled={busy}
                                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                            >
                                <Trash2 size={16} /> Șterge
                            </button>
                        )}
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>

                <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
        </div>
    );
};
