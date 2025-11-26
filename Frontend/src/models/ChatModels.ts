export interface ChatUser {
    id: string;
    fullName: string;
    profilePictureUrl: string | null;
}

export interface ConversationContext {
    type: 'Booking' | 'Review';
    bookingId: number;
    bookingTitle: string;
    reviewId: number | null;
    checkInDate?: string;
    checkOutDate?: string;
}

export interface ChatMessage {
    id: number;
    senderId: string;
    content: string;
    sentAt: string;
    photos: string[];
}

export interface ConversationSummary {
    id: number;
    recipient: ChatUser;
    lastMessage: ChatMessage;
    isUnread: boolean;
    context: ConversationContext;
}

export interface GetConversationsParams {
    PageNumber?: number;
    PageSize?: number;
    Role: 'host' | 'guest';
}

export interface GetMessagesParams {
    PageNumber?: number;
    PageSize?: number;
}

export interface SendMessageRequest {
    conversationId: number;
    content: string;
}