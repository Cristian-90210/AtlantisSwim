import * as signalR from '@microsoft/signalr';
import axiosInstance from '../api/axiosInstance';

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    sentAt: string;
    isRead: boolean;
    senderName?: string;   // included on live messages pushed by the hub
    isEdited?: boolean;
    editedAt?: string | null;
    isDeleted?: boolean;
}

export interface ChatUser {
    id: number;
    firstName: string;
    lastName: string;
    role: number;
    lastMessageAt?: string | null;     // ISO timestamp of the most recent message, if any
    lastMessageContent?: string | null;
    unreadCount?: number;              // unread messages this contact sent me
}

type MessageHandler = (message: ChatMessage) => void;
type PresenceHandler = (userId: number, online: boolean) => void;
type UserIdHandler = (userId: number) => void;

class ChatService {
    private connection: signalR.HubConnection | null = null;
    private handlers: MessageHandler[] = [];
    private updateHandlers: MessageHandler[] = [];
    private presenceHandlers: PresenceHandler[] = [];
    private typingHandlers: UserIdHandler[] = [];
    private readHandlers: UserIdHandler[] = [];
    private connectPromise: Promise<void> | null = null;

    async connect(): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) return;
        // Guard against concurrent connect() calls (e.g. the global provider and a
        // chat page both connecting at once) creating duplicate connections.
        if (this.connectPromise) return this.connectPromise;

        this.connectPromise = (async () => {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5000/hubs/chat', {
                    accessTokenFactory: () => localStorage.getItem('auth_token') ?? '',
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Warning)
                .build();

            connection.on('ReceiveMessage', (msg: ChatMessage) => {
                this.handlers.forEach(h => h(msg));
            });

            // Edited / deleted messages are pushed here so open chats update live.
            connection.on('MessageUpdated', (msg: ChatMessage) => {
                this.updateHandlers.forEach(h => h(msg));
            });

            // Presence (online / offline)
            connection.on('UserOnline',  (userId: number) => this.presenceHandlers.forEach(h => h(userId, true)));
            connection.on('UserOffline', (userId: number) => this.presenceHandlers.forEach(h => h(userId, false)));
            // Typing indicator + read receipts
            connection.on('UserTyping',   (userId: number) => this.typingHandlers.forEach(h => h(userId)));
            connection.on('MessagesRead', (userId: number) => this.readHandlers.forEach(h => h(userId)));

            await connection.start();
            this.connection = connection;
        })();

        try {
            await this.connectPromise;
        } finally {
            this.connectPromise = null;
        }
    }

    async disconnect(): Promise<void> {
        await this.connection?.stop();
        this.connection = null;
        this.handlers = [];
        this.updateHandlers = [];
        this.presenceHandlers = [];
        this.typingHandlers = [];
        this.readHandlers = [];
    }

    // Presence — fires (userId, online) whenever a contact connects/disconnects.
    onPresence(handler: PresenceHandler): () => void {
        this.presenceHandlers.push(handler);
        return () => { this.presenceHandlers = this.presenceHandlers.filter(h => h !== handler); };
    }

    // Fires with the id of a contact who is currently typing to me.
    onTyping(handler: UserIdHandler): () => void {
        this.typingHandlers.push(handler);
        return () => { this.typingHandlers = this.typingHandlers.filter(h => h !== handler); };
    }

    // Fires with the id of a contact who just read my messages.
    onMessagesRead(handler: UserIdHandler): () => void {
        this.readHandlers.push(handler);
        return () => { this.readHandlers = this.readHandlers.filter(h => h !== handler); };
    }

    async getOnlineUsers(): Promise<number[]> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
            await this.connect();
        }
        return this.connection!.invoke<number[]>('GetOnlineUsers');
    }

    async sendTyping(receiverId: number): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            try { await this.connection.invoke('Typing', receiverId); } catch { /* ignore */ }
        }
    }

    onMessage(handler: MessageHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    // Subscribe to edit/delete updates for already-sent messages.
    onMessageUpdate(handler: MessageHandler): () => void {
        this.updateHandlers.push(handler);
        return () => {
            this.updateHandlers = this.updateHandlers.filter(h => h !== handler);
        };
    }

    async sendMessage(receiverId: number, content: string): Promise<void> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
            await this.connect();
        }
        await this.connection!.invoke('SendMessage', receiverId, content);
    }

    async editMessage(messageId: number, content: string): Promise<void> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
            await this.connect();
        }
        await this.connection!.invoke('EditMessage', messageId, content);
    }

    async deleteMessage(messageId: number): Promise<void> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
            await this.connect();
        }
        await this.connection!.invoke('DeleteMessage', messageId);
    }

    async markRead(senderId: number): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke('MarkRead', senderId);
        }
    }

    async getHistory(otherUserId: number): Promise<ChatMessage[]> {
        const res = await axiosInstance.get<ChatMessage[]>(`/chat/history/${otherUserId}`);
        return res.data;
    }

    async getUsers(): Promise<ChatUser[]> {
        const res = await axiosInstance.get<ChatUser[]>('/chat/users');
        return res.data;
    }
}

export const chatService = new ChatService();
