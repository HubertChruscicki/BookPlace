import React from 'react';
import {
    Container,
    Typography,
    Box,
} from '@mui/material';
import BookingsStatusSections from '../components/features/booking/BookingsStatusSections';
import { useUserBookings } from '../hooks/useBooking';

const MyBookingsPage: React.FC = () => {
    const { data: bookingsResponse, isLoading, isError } = useUserBookings({ limit: 20 });
    
    const bookings = bookingsResponse?.items || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                    }}
                >
                    My reservations
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Manage your reservations and check travel details
                </Typography>
            </Box>

            <BookingsStatusSections 
                bookings={bookings}
                isLoading={isLoading}
                isError={isError}
            />
        </Container>
    );
};

export default MyBookingsPage;
