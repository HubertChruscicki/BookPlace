export interface CreateBookingRequest {
    offerId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
}

export interface BookingHost {
    id: string;
    name: string;
    avatarUrl: string | null;
}

export interface BookingOffer {
    id: number;
    title: string;
    addressStreet: string;
    addressCity: string;
    addressZipCode: string;
    addressCountry: string;
    fullAddress: string;
    addressLatitude: number;
    addressLongitude: number;
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
    status: 'Pending' | 'Confirmed' | 'CancelledByHost' | 'CancelledByGuest' | 'Completed';
    createdAt: string;
    offer: BookingOffer;
    host: BookingHost;
}

export interface GetUserBookingsParams {
    limit?: number;
}

export interface GetUserBookingsResponse {
    items: BookingItem[];
}