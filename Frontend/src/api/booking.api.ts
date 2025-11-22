import apiClient from './apiClient';
import type { CreateBookingRequest } from '../models/BookingModels';

export const createBooking = async (payload: CreateBookingRequest) => {
    const { data } = await apiClient.post('/Booking', payload);
    return data;
};
