import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchConversations, fetchMessages, sendMessage, markAsRead } from '../api/chat.api';
import type { GetConversationsParams, GetMessagesParams } from '../models/ChatModels';

export const CHAT_KEYS = {
    conversations: (params: any) => ['conversations', params],
    messages: (convId: number, params: any) => ['messages', convId, params],
};

export const useConversations = (params: GetConversationsParams) => {
    return useQuery({
        queryKey: CHAT_KEYS.conversations(params),
        queryFn: () => fetchConversations(params),
        placeholderData: keepPreviousData,
        refetchInterval: 30000,
    });
};

export const useChatMessages = (conversationId: number | null, params: GetMessagesParams) => {
    return useQuery({
        queryKey: CHAT_KEYS.messages(conversationId || 0, params),
        queryFn: () => fetchMessages(conversationId!, params),
        enabled: !!conversationId,
        placeholderData: keepPreviousData,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendMessage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['messages', variables.conversationId]
            });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};