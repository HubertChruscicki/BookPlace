import apiClient from './apiClient';
import type { 
    CreateBookingRequest, 
    GetUserBookingsParams, 
    GetUserBookingsResponse,
    BookingItem
} from '../models/BookingModels';

export const createBooking = async (payload: CreateBookingRequest) => {
    const { data } = await apiClient.post('/Booking', payload);
    return data;
};

export const fetchUserBookings = async (params: GetUserBookingsParams = {}): Promise<GetUserBookingsResponse> => {
    const { data } = await apiClient.get<GetUserBookingsResponse>('/Booking', { 
        params: {
            limit: params.limit || 20,
            Role: 'guest'
        }
    });
    return data;
};

export const fetchBookingDetails = async (bookingId: string | number): Promise<BookingItem> => {
    const { data } = await apiClient.get<BookingItem>(`/Booking/${bookingId}`);
    return data;
};
