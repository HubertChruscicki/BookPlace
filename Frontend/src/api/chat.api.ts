import apiClient from './apiClient';
import type { PageResult } from '../models/PageResultModel';
import type {
    ConversationSummary,
    ChatMessage,
    GetConversationsParams,
    GetMessagesParams,
    SendMessageRequest
} from '../models/ChatModels';

export const fetchConversations = async (params: GetConversationsParams): Promise<PageResult<ConversationSummary>> => {
    const { data } = await apiClient.get<PageResult<ConversationSummary>>('/conversations', { params });
    return data;
};

export const fetchMessages = async (conversationId: number, params: GetMessagesParams): Promise<PageResult<ChatMessage>> => {
    const { data } = await apiClient.get<PageResult<ChatMessage>>(`/conversations/${conversationId}/messages`, { params });
    return data;
};

export const sendMessage = async (payload: SendMessageRequest) => {
    const { data } = await apiClient.post(`/conversations/${payload.conversationId}/messages`, {
        content: payload.content
    });
    return data;
};

export const markAsRead = async (conversationId: number) => {
    await apiClient.put(`/conversations/${conversationId}/read`);
};