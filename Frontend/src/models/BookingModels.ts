export interface CreateBookingRequest {
    offerId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
}

export interface BookingSummary {
    offerId: number;
    offerTitle: string;
    pricePerNight: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    totalNights: number;
    totalPrice: number;
}

