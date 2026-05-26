import * as signalR from '@microsoft/signalr';
import axiosInstance from '../api/axiosInstance';

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    sentAt: string;
    isRead: boolean;
}

export interface ChatUser {
    id: number;
    firstName: string;
    lastName: string;
    role: number;
}

type MessageHandler = (message: ChatMessage) => void;

class ChatService {
    private connection: signalR.HubConnection | null = null;
    private handlers: MessageHandler[] = [];

    async connect(): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/chat', {
                accessTokenFactory: () => localStorage.getItem('auth_token') ?? '',
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.connection.on('ReceiveMessage', (msg: ChatMessage) => {
            this.handlers.forEach(h => h(msg));
        });

        await this.connection.start();
    }

    async disconnect(): Promise<void> {
        await this.connection?.stop();
        this.connection = null;
        this.handlers = [];
    }

    onMessage(handler: MessageHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(h => h !== handler);
        };
    }

    async sendMessage(receiverId: number, content: string): Promise<void> {
        if (this.connection?.state !== signalR.HubConnectionState.Connected) {
            await this.connect();
        }
        await this.connection!.invoke('SendMessage', receiverId, content);
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
