export interface HostBookingFilters {
    status: 'all' | 'upcoming' | 'past' | 'canceled';
    sortBy: 'date' | 'price' | 'guest';
    sortOrder: 'asc' | 'desc';
}

export interface HostBooking {
    id: string;
    offerId: string;
    offerTitle: string;
    offerThumbnailUrl: string;
    guestName: string;
    guestEmail: string;
    guestProfilePictureUrl?: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: 'upcoming' | 'past' | 'canceled' | 'active';
    guestsCount: number;
    paymentStatus: 'paid' | 'pending' | 'refunded';
    createdAt: string;
}

export interface HostStats {
    totalBookings: number;
    monthlyRevenue: number;
    activeOffers: number;
    occupancyRate: number;
    averageRating: number;
    totalGuests: number;
}

export interface HostOffer {
    id: string;
    title: string;
    location: string;
    pricePerNight: number;
    thumbnailUrl: string;
    isActive: boolean;
    totalBookings: number;
    averageRating: number;
    lastBookingDate?: string;
    createdAt: string;
}

export interface ChatConversation {
    id: string;
    guestName: string;
    guestProfilePictureUrl?: string;
    offerId: string;
    offerTitle: string;
    lastMessage: string;
    lastMessageDate: string;
    unreadCount: number;
    status: 'active' | 'resolved';
}

export type HostSection = 'dashboard' | 'bookings' | 'calendar' | 'offers' | 'inbox';