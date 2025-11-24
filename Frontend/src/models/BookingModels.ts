// src/models/BookingModels.ts

export interface BookingUser {
    id: string;
    name: string;
    avatarUrl: string | null;
}

export interface BookingOffer {
    id: number;
    title: string;
    addressStreet: string;
    addressCity: string;
    fullAddress: string;
    coverPhotoUrl: string;
    offerType: string;
}

export interface BookingItem {
    id: number;
    guestId: string;
    offerId: number;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    numberOfGuests: number;
    status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending'; // Statusy API
    createdAt: string;
    offer: BookingOffer;
    host: BookingUser;
    guest: BookingUser;
}

export interface GetUserBookingsResponse {
    items: BookingItem[];
    totalPages: number;
    totalItemsCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface GetUserBookingsParams {
    PageNumber?: number;
    PageSize?: number;
    Role?: 'guest' | 'host'; 
    Status?: string;
    OfferId?: number;
}

export interface CreateBookingRequest {
    offerId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
}