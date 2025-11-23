import React from 'react';
import {Container} from '@mui/material';
import BookingsStatusSections from '../components/features/booking/BookingsStatusSections';
import { useUserBookings } from '../hooks/useBooking';

const MyBookingsPage: React.FC = () => {
    const { data: bookingsResponse, isLoading, isError } = useUserBookings({ limit: 20 });
    const bookings = bookingsResponse?.items || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <BookingsStatusSections 
                bookings={bookings}
                isLoading={isLoading}
                isError={isError}
            />
        </Container>
    );
};

export default MyBookingsPage;
