import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockCoaches } from '../../data/mockData';
import {
    MessageCircle, Send, Phone, Video, MoreVertical, Paperclip, Smile, X, Info, CheckCheck, Search, ChevronLeft, Share2, Lock, BellOff, Camera
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { clsx } from 'clsx';
import type { Message } from '../../types';
import { messageService } from '../../services/api';

export const StudentChat: React.FC = () => {
    const { user } = useAuth();
    const studentId = user?.id || 'user-1';

    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedCoachId, setSelectedCoachId] = useState(mockCoaches[0]?.id || 'c1');
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        messageService.getByUser(studentId).then(data => {
            setAllMessages(data);
            setIsLoading(false);
        });
    }, [studentId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            const scrollTimeout = setTimeout(() => {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }, 50);
            return () => clearTimeout(scrollTimeout);
        }
    }, [allMessages, selectedCoachId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        const coach = mockCoaches.find(c => c.id === selectedCoachId);
        const sent = await messageService.send({
            senderId: user.id,
            senderName: user.name,
            receiverId: selectedCoachId,
            receiverName: coach ? `Antrenor ${coach.name}` : 'Antrenor',
            content: newMessage,
        });
        setAllMessages(prev => [...prev, sent]);
        setNewMessage('');
    };

    const conversations = useMemo(() => {
        return mockCoaches
            .map(coach => {
                const msgs = allMessages.filter(
                    m => (m.senderId === studentId && m.receiverId === coach.id) ||
                        (m.senderId === coach.id && m.receiverId === studentId) ||
                        (m.receiverName?.includes(coach.name) && m.senderId === studentId) ||
                        (m.senderName?.includes(coach.name) && m.receiverId === studentId)
                );
                const lastMessage = msgs[msgs.length - 1];
                const unreadCount = msgs.filter(m => m.senderId !== studentId && !m.read).length;
                return {
                    id: coach.id,
                    name: `Antrenor ${coach.name}`,
                    coachName: coach.name,
                    specialization: coach.specialization,
                    avatar: coach.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.name)}&background=random`,
                    lastMessage,
                    unreadCount
                };
            })
            .sort((a, b) => {
                const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
                const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
                return timeB - timeA;
            });
    }, [allMessages, studentId]);

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.coachName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeConv = conversations.find(c => c.id === selectedCoachId);

    const activeMessages = useMemo(() => {
        if (!selectedCoachId) return [];
        return allMessages.filter(
            m => (m.senderId === studentId && m.receiverId === selectedCoachId) ||
                (m.senderId === selectedCoachId && m.receiverId === studentId) ||
                (m.receiverName?.includes(activeConv?.coachName || '') && m.senderId === studentId) ||
                (m.senderName?.includes(activeConv?.coachName || '') && m.receiverId === studentId)
        );
    }, [allMessages, selectedCoachId, studentId, activeConv]);

    function formatTime(iso: string) {
        const d = new Date(iso);
        return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-100 flex flex-col font-outfit">
            <PageHeader
                title={<>SMART <span className="text-host-cyan uppercase tracking-widest">Communication</span></>}
                subtitle="High-performance chat interface for direct student-coach coordination."
            />

            <div className="container mx-auto px-6 mt-6 mb-10 flex-1 flex relative z-20">
                <main className="flex-1 flex bg-[#1e293b]/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden border-b-8 border-b-host-cyan/20">

                    <aside className="w-[380px] border-r border-white/5 flex flex-col bg-[#1e293b]/50">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-extrabold tracking-tight">Chats</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-host-cyan transition-colors bg-white/5 rounded-xl">
                                        <BellOff size={18} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-host-cyan transition-colors bg-white/5 rounded-xl">
                                        <MoreVertical size={18} />
                                    </button>
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-host-cyan/30 transition-all placeholder:text-gray-500 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
                            {filteredConversations.map(conv => {
                                const isActive = selectedCoachId === conv.id;
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedCoachId(conv.id)}
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
                                                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ''}</span>
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

                    <div className="flex-1 flex flex-col bg-[#0f172a]/20">
                        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
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

                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95 relative" style={{ height: '500px' }}>
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
                                    <p className="text-gray-500 text-sm leading-relaxed">Această conversație este securizată. Salută-l pe <b>{activeConv?.name}</b>.</p>
                                </div>
                            ) : (
                                activeMessages.map((m) => {
                                    const isMine = m.senderId === studentId;
                                    return (
                                        <div key={m.id} className={clsx('flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300', isMine ? 'items-end' : 'items-start')}>
                                            <div className={clsx('group relative max-w-[65%] px-6 py-4 rounded-[1.8rem] shadow-xl', isMine ? 'bg-host-cyan text-[#0f172a] rounded-tr-sm font-medium pr-10' : 'bg-[#1e293b] text-gray-100 rounded-tl-sm font-normal pl-10 border border-white/5')}>
                                                {!isMine && <div className="absolute top-4 left-4 text-host-cyan/30 flex-shrink-0"><MessageCircle size={14} /></div>}
                                                <p className="text-[0.95rem] leading-relaxed break-words">{m.content}</p>
                                                <div className={clsx("flex items-center gap-1.5 mt-2 justify-end opacity-60", isMine ? "text-[#0f172a]" : "text-gray-500")}>
                                                    <span className="text-[10px] font-bold">{formatTime(m.timestamp)}</span>
                                                    {isMine && <CheckCheck size={14} className="opacity-80" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-8 pb-10">
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

                    {isProfileOpen && (
                        <aside className="w-[360px] border-l border-white/5 flex flex-col bg-[#1e293b]/50 animate-in slide-in-from-right duration-500">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-extrabold text-sm uppercase tracking-widest text-gray-400">Info Antrenor</h3>
                                <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-xl"><X size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="text-center mb-10">
                                    <div className="relative inline-block mb-6 group cursor-pointer">
                                        <div className="absolute inset-0 bg-host-cyan/30 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                        <img src={activeConv?.avatar} className="w-44 h-44 rounded-[3.5rem] border-4 border-white/5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105 object-cover" />
                                        <div className="absolute bottom-2 right-2 z-20 bg-[#1e293b] p-3 rounded-2xl border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={20} className="text-host-cyan" /></div>
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-2">{activeConv?.name}</h2>
                                    <p className="text-host-cyan font-bold uppercase tracking-widest text-[11px] mb-8">{activeConv?.specialization || 'Antrenor Înot'}</p>

                                    <div className="flex gap-2 justify-center">
                                        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-3xl transition-all flex flex-col items-center gap-2"><Share2 size={20} className="text-gray-400" /><span className="text-[10px] font-bold uppercase text-gray-500">Share</span></button>
                                        <button className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/5 p-4 rounded-3xl transition-all flex flex-col items-center gap-2 group"><BellOff size={20} className="text-gray-400 group-hover:text-red-500" /><span className="text-[10px] font-bold uppercase text-gray-500">Mute</span></button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 block">Info Contact</label>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4"><div className="p-3 bg-white/5 rounded-2xl"><Phone size={18} className="text-gray-500" /></div><span className="text-[13px] text-gray-300 font-medium">+40 732 123 456</span></div>
                                            <div className="flex items-center gap-4"><div className="p-3 bg-white/5 rounded-2xl"><Lock size={18} className="text-gray-500" /></div><span className="text-[13px] text-gray-300 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">End-to-End Encrypted</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}
                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.2); }
                div { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.05) transparent; }
            `}</style>
        </div>
    );
};
