import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Stack,
} from '@mui/material';
import HorizontalBookingScroll from './HorizontalBookingScroll';
import type {BookingItem} from "../../../models/BookingModels.ts";

interface BookingsStatusSectionsProps {
    bookings: BookingItem[];
    isLoading: boolean;
    isError: boolean;
}

const BookingsStatusSections: React.FC<BookingsStatusSectionsProps> = ({
    bookings,
    isLoading,
    isError,
}) => {
    const categorizedBookings = useMemo(() => {
        const now = new Date();
        
        return bookings.reduce((acc, booking) => {
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);
            
            if (booking.status === 'CancelledByHost' || booking.status === 'CancelledByGuest') {
                acc.cancelled.push(booking);
            } else if (booking.status === 'Completed' || checkOutDate < now) {
                acc.past.push(booking);
            } else if (checkInDate > now) {
                acc.upcoming.push(booking);
            } else {
                acc.upcoming.push(booking);
            }
            
            return acc;
        }, {
            upcoming: [] as BookingItem[],
            past: [] as BookingItem[],
            cancelled: [] as BookingItem[],
        });
    }, [bookings]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress size={60} />
                    <Typography variant="h6" color="text.secondary">
                        Loading reservations...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert 
                severity="error" 
                sx={{ 
                    borderRadius: 2,
                    mb: 3,
                }}
            >
                An error occurred while loading reservations. Please try again later.
            </Alert>
        );
    }

    if (bookings.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    py: 8,
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 700, 
                        mb: 2,
                        color: 'text.primary',
                    }}
                >
                    No reservations
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    You don't have any reservations yet. Start browsing offers!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <HorizontalBookingScroll
                title="Upcoming reservations"
                bookings={categorizedBookings.upcoming}
                emptyMessage="You have no upcoming reservations."
                maxVisible={3}
            />
            
            <HorizontalBookingScroll
                title="Past reservations"
                bookings={categorizedBookings.past}
                emptyMessage="You have no past reservations."
                maxVisible={3}
            />
            
            <HorizontalBookingScroll
                title="Cancelled reservations"
                bookings={categorizedBookings.cancelled}
                emptyMessage="You have no cancelled reservations."
                maxVisible={3}
            />
        </Box>
    );
};

export default BookingsStatusSections;

