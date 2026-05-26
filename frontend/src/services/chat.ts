import api from './api';
import type { Chat, ChatMessage } from '../types';

export const chatService = {
  getChats: () =>
    api.get<Chat[]>('/chat').then(r => r.data),

  createChat: (participantId: string) =>
    api.post<Chat>('/chat', { participantId }).then(r => r.data),

  getMessages: (chatId: string) =>
    api.get<ChatMessage[]>(`/chat/${chatId}/messages`).then(r => r.data),

  sendMessage: (chatId: string, content: string, type = 'text') =>
    api.post<ChatMessage>(`/chat/${chatId}/messages`, { content, type }).then(r => r.data),
};
