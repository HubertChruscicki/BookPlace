import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createBooking, fetchUserBookings, fetchBookingDetails } from '../api/booking.api';
import type {
    CreateBookingRequest,
    GetUserBookingsParams,
    GetUserBookingsResponse,
    BookingItem
} from '../models/BookingModels';
import { BOOKING_QUERY_KEYS } from '../constants/queryKeys';

export const useCreateBooking = () => {
    return useMutation<unknown, AxiosError, CreateBookingRequest>({
        mutationFn: createBooking,
    });
};

export const useUserBookings = (params: GetUserBookingsParams) => {
    return useQuery<GetUserBookingsResponse, AxiosError>({
        queryKey: ['bookings', params],
        queryFn: () => fetchUserBookings(params),
        placeholderData: keepPreviousData,
    });
};

export const useBookingDetails = (bookingId: string | number) => {
    return useQuery<BookingItem, AxiosError>({
        queryKey: BOOKING_QUERY_KEYS.detail(bookingId),
        queryFn: () => fetchBookingDetails(bookingId),
        enabled: !!bookingId,
    });
};