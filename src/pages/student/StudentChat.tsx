import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MessageCircle, Send, Phone, Video, MoreVertical, Paperclip, Smile, X, Info,
    CheckCheck, Search, ChevronLeft, Share2, Lock, BellOff, Camera
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { clsx } from 'clsx';
import { chatService } from '../../services/chatService';
import type { ChatMessage, ChatUser } from '../../services/chatService';

export const StudentChat: React.FC = () => {
    const { user } = useAuth();
    const myId = parseInt(user?.id ?? '0');

    const [coaches, setCoaches] = useState<ChatUser[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Connect SignalR once and load coaches
    useEffect(() => {
        let cancelled = false;
        let unsubscribe: (() => void) | null = null;

        (async () => {
            try {
                const users = await chatService.getUsers();
                if (cancelled) return;
                setCoaches(users);
                if (users.length > 0) setSelectedId(users[0].id);

                await chatService.connect();
                if (cancelled) {
                    chatService.disconnect();
                    return;
                }

                // Deduplicate by ID to guard against StrictMode double-registration
                unsubscribe = chatService.onMessage(msg => {
                    setMessages(prev =>
                        prev.some(m => m.id === msg.id) ? prev : [...prev, msg]
                    );
                });
            } catch (err) {
                if (!cancelled) console.error('Chat init error', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
            unsubscribe?.();
            chatService.disconnect();
        };
    }, []);

    // Load history when selected coach changes
    useEffect(() => {
        if (!selectedId) return;
        setIsLoading(true);
        chatService.getHistory(selectedId)
            .then(data => setMessages(data))
            .catch(() => setMessages([]))
            .finally(() => setIsLoading(false));
    }, [selectedId]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        const t = setTimeout(() => {
            const el = chatContainerRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        }, 50);
        return () => clearTimeout(t);
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedId) return;
        const text = newMessage.trim();
        setNewMessage('');
        try {
            await chatService.sendMessage(selectedId, text);
        } catch (err) {
            console.error('Send failed', err);
            setNewMessage(text);
        }
    };

    const activeMessages = useMemo(() =>
        messages.filter(m =>
            (m.senderId === myId && m.receiverId === selectedId) ||
            (m.senderId === selectedId && m.receiverId === myId)
        ),
        [messages, myId, selectedId]
    );

    const conversations = useMemo(() =>
        coaches
            .map(coach => {
                const msgs = messages.filter(m =>
                    (m.senderId === myId && m.receiverId === coach.id) ||
                    (m.senderId === coach.id && m.receiverId === myId)
                );
                const last = msgs[msgs.length - 1];
                const unread = msgs.filter(m => m.senderId !== myId && !m.isRead).length;
                return {
                    id: coach.id,
                    name: `Antrenor ${coach.firstName} ${coach.lastName}`.trim(),
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.firstName + '+' + coach.lastName)}&background=random`,
                    lastMessage: last,
                    unreadCount: unread,
                };
            })
            .sort((a, b) => {
                const ta = a.lastMessage ? new Date(a.lastMessage.sentAt).getTime() : 0;
                const tb = b.lastMessage ? new Date(b.lastMessage.sentAt).getTime() : 0;
                return tb - ta;
            }),
        [coaches, messages, myId]
    );

    const filtered = conversations.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeConv = conversations.find(c => c.id === selectedId);

    function formatTime(iso: string) {
        return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="h-screen bg-[#0f172a] text-gray-100 flex flex-col font-outfit overflow-hidden">
            <PageHeader
                title={<>SMART <span className="text-host-cyan uppercase tracking-widest">Communication</span></>}
                subtitle="High-performance chat interface for direct student-coach coordination."
            />

            {/* flex-1 + min-h-0 ensures this fills remaining height without overflowing */}
            <div className="flex-1 min-h-0 flex px-6 pb-6 pt-4 relative z-20">
                <div className="container mx-auto flex flex-1 min-h-0">
                    <main className="flex-1 min-h-0 flex bg-[#1e293b]/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden border-b-8 border-b-host-cyan/20">

                        {/* Left panel */}
                        <aside className="w-[380px] border-r border-white/5 flex flex-col bg-[#1e293b]/50 min-h-0">
                            <div className="p-6 flex-shrink-0">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-extrabold tracking-tight">Chats</h2>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-host-cyan transition-colors bg-white/5 rounded-xl"><BellOff size={18} /></button>
                                        <button className="p-2 text-gray-400 hover:text-host-cyan transition-colors bg-white/5 rounded-xl"><MoreVertical size={18} /></button>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-host-cyan transition-colors">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Caută antrenor..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-host-cyan/30 transition-all placeholder:text-gray-500 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar min-h-0">
                                {filtered.map(conv => {
                                    const isActive = selectedId === conv.id;
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => setSelectedId(conv.id)}
                                            className={clsx(
                                                "w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all duration-300 group relative mb-2",
                                                isActive ? "bg-gradient-to-r from-host-cyan/20 to-transparent border border-white/10 shadow-lg" : "hover:bg-white/5 border border-transparent"
                                            )}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className={clsx("w-14 h-14 rounded-3xl overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105", isActive ? "border-host-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "border-white/10")}>
                                                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#1e293b]"></div>
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={clsx("font-bold text-[0.95rem] truncate transition-colors", isActive ? "text-host-cyan" : "text-gray-100")}>{conv.name}</span>
                                                    <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{conv.lastMessage ? formatTime(conv.lastMessage.sentAt) : ''}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[13px] text-gray-400 truncate leading-relaxed">{conv.lastMessage?.content || 'Apasă pentru chat...'}</p>
                                                    {conv.unreadCount > 0 && <span className="bg-host-cyan text-[#0f172a] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ml-2 shadow-[0_0_10px_rgba(34,211,238,0.5)]">{conv.unreadCount}</span>}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Main chat — flex column with bounded height */}
                        <div className="flex-1 min-h-0 flex flex-col bg-[#0f172a]/20">
                            <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <button className="lg:hidden p-2 text-gray-400 hover:text-white"><ChevronLeft /></button>
                                    <div className="relative">
                                        <img src={activeConv?.avatar} className="w-12 h-12 rounded-2xl border border-white/10 object-cover" />
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#1e293b]"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-gray-100">{activeConv?.name}</h3>
                                        <p className="text-[11px] text-green-500 font-bold uppercase tracking-widest opacity-80">Online</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 text-gray-400 hover:text-host-cyan transition-all hover:bg-white/5 rounded-xl"><Phone size={20} /></button>
                                    <button className="p-2.5 text-gray-400 hover:text-host-cyan transition-all hover:bg-white/5 rounded-xl"><Video size={20} /></button>
                                    <div className="w-[1px] h-6 bg-white/5 mx-2" />
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={clsx("p-2.5 transition-all rounded-xl", isProfileOpen ? "text-host-cyan bg-host-cyan/10" : "text-gray-400 hover:text-white hover:bg-white/5")}><Info size={20} /></button>
                                </div>
                            </div>

                            {/* Messages — flex-1 + overflow-y-auto = scrolls only here */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 min-h-0 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
                            >
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div className="w-12 h-12 border-4 border-host-cyan/20 border-t-host-cyan rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-bold uppercase tracking-tighter text-sm">Sincronizare mesaje...</p>
                                    </div>
                                ) : activeMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                                        <div className="w-20 h-20 bg-gradient-to-br from-host-cyan/20 to-host-blue/20 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl">
                                            <MessageCircle size={32} className="text-host-cyan" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Canal Privat</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">Salută-l pe <b>{activeConv?.name}</b> pentru a începe.</p>
                                    </div>
                                ) : (
                                    activeMessages.map(m => {
                                        const isMine = m.senderId === myId;
                                        return (
                                            <div key={m.id} className={clsx('flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300', isMine ? 'items-end' : 'items-start')}>
                                                <div className={clsx('group relative max-w-[65%] px-6 py-4 rounded-[1.8rem] shadow-xl', isMine ? 'bg-host-cyan text-[#0f172a] rounded-tr-sm font-medium pr-10' : 'bg-[#1e293b] text-gray-100 rounded-tl-sm font-normal pl-10 border border-white/5')}>
                                                    {!isMine && <div className="absolute top-4 left-4 text-host-cyan/30 flex-shrink-0"><MessageCircle size={14} /></div>}
                                                    <p className="text-[0.95rem] leading-relaxed break-words">{m.content}</p>
                                                    <div className={clsx("flex items-center gap-1.5 mt-2 justify-end opacity-60", isMine ? "text-[#0f172a]" : "text-gray-500")}>
                                                        <span className="text-[10px] font-bold">{formatTime(m.sentAt)}</span>
                                                        {isMine && <CheckCheck size={14} className="opacity-80" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="p-6 flex-shrink-0">
                                <div className="bg-[#1e293b] border border-white/10 rounded-[2rem] p-3 flex items-center gap-2 shadow-2xl focus-within:ring-2 focus-within:ring-host-cyan/30 transition-all group">
                                    <button className="p-3 text-gray-400 hover:text-host-cyan transition-colors hover:bg-white/5 rounded-2xl"><Paperclip size={22} /></button>
                                    <textarea
                                        rows={1}
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                        placeholder="Mesajul tău..."
                                        className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-[0.95rem] placeholder:text-gray-500 max-h-32 min-h-[44px]"
                                    />
                                    <button className="p-3 text-gray-400 hover:text-host-cyan transition-colors hover:bg-white/5 rounded-2xl"><Smile size={22} /></button>
                                    <button onClick={handleSendMessage} disabled={!newMessage.trim()} className={clsx("p-4 rounded-3xl transition-all duration-300 flex-shrink-0 shadow-lg", newMessage.trim() ? "bg-host-cyan text-[#0f172a] hover:scale-110 active:scale-95 shadow-host-cyan/20" : "bg-white/5 text-gray-600 cursor-not-allowed opacity-50")}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right panel */}
                        {isProfileOpen && (
                            <aside className="w-[360px] border-l border-white/5 flex flex-col bg-[#1e293b]/50 animate-in slide-in-from-right duration-500 min-h-0">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                    <h3 className="font-extrabold text-sm uppercase tracking-widest text-gray-400">Info Antrenor</h3>
                                    <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl"><X size={20} /></button>
                                </div>
                                <div className="flex-1 min-h-0 overflow-y-auto p-8 custom-scrollbar">
                                    <div className="text-center mb-10">
                                        <div className="relative inline-block mb-6 group cursor-pointer">
                                            <div className="absolute inset-0 bg-host-cyan/30 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                            <img src={activeConv?.avatar} className="w-44 h-44 rounded-[3.5rem] border-4 border-white/5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105 object-cover" />
                                            <div className="absolute bottom-2 right-2 z-20 bg-[#1e293b] p-3 rounded-2xl border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={20} className="text-host-cyan" /></div>
                                        </div>
                                        <h2 className="text-2xl font-black text-white mb-2">{activeConv?.name}</h2>
                                        <p className="text-host-cyan font-bold uppercase tracking-widest text-[11px] mb-8">Antrenor Înot</p>
                                        <div className="flex gap-2 justify-center">
                                            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-3xl transition-all flex flex-col items-center gap-2"><Share2 size={20} className="text-gray-400" /><span className="text-[10px] font-bold uppercase text-gray-500">Share</span></button>
                                            <button className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/5 p-4 rounded-3xl transition-all flex flex-col items-center gap-2 group"><BellOff size={20} className="text-gray-400 group-hover:text-red-500" /><span className="text-[10px] font-bold uppercase text-gray-500">Mute</span></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 block">Info Contact</label>
                                        <div className="flex items-center gap-4"><div className="p-3 bg-white/5 rounded-2xl"><Lock size={18} className="text-gray-500" /></div><span className="text-[13px] text-gray-300 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">End-to-End Encrypted</span></div>
                                    </div>
                                </div>
                            </aside>
                        )}
                    </main>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.2); }
            `}</style>
        </div>
    );
};
