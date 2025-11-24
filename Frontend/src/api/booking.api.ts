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
    const queryParams = {
        PageNumber: params.PageNumber || 1,
        PageSize: params.PageSize || 20,
        Role: params.Role || 'guest',
        Status: params.Status,
        OfferId: params.OfferId,
        DateFrom: params.DateFrom,
        DateTo: params.DateTo,
    };

    const { data } = await apiClient.get<GetUserBookingsResponse>('/Booking', {
        params: queryParams
    });
    return data;
};

export const fetchBookingDetails = async (bookingId: string | number): Promise<BookingItem> => {
    const { data } = await apiClient.get<BookingItem>(`/Booking/${bookingId}`);
    return data;
};