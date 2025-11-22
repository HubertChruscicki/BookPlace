import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createBooking } from '../api/booking.api';
import type { CreateBookingRequest } from '../models/BookingModels';
import { BOOKING_QUERY_KEYS } from '../constants/queryKeys';

export const useCreateBooking = () => {
    return useMutation<unknown, AxiosError, CreateBookingRequest>({
        mutationKey: BOOKING_QUERY_KEYS.create(),
        mutationFn: createBooking,
    });
};

