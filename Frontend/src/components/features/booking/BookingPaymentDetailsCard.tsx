import React, { useMemo } from 'react';
import { Box, Typography, Paper, Divider, Stack } from '@mui/material';
import type { BookingItem } from '../../../models/BookingModels';
import dayjs from 'dayjs';

interface BookingPaymentDetailsCardProps {
    booking: BookingItem;
}

const SERVICE_FEE_RATE = 0.12;

const BookingPaymentDetailsCard: React.FC<BookingPaymentDetailsCardProps> = ({ booking }) => {

    const { nights, pricePerNight, stayCost, serviceFee } = useMemo(() => {
        const checkIn = dayjs(booking.checkInDate);
        const checkOut = dayjs(booking.checkOutDate);
        const nights = checkOut.diff(checkIn, 'day');

        const totalCost = booking.totalPrice;

        const stayCost = totalCost / (1 + SERVICE_FEE_RATE);
        const serviceFee = totalCost - stayCost;
        const pricePerNight = stayCost / nights;

        return { nights, pricePerNight, stayCost, serviceFee };
    }, [booking.checkInDate, booking.checkOutDate, booking.totalPrice]);

    const currency = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }), []);

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Payment details
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" color="text.secondary">
                        {currency.format(pricePerNight)} x {nights} nights
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {currency.format(stayCost)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" color="text.secondary">
                        BookPlace service fee (12%)
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {currency.format(serviceFee)}
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700}>Total paid</Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                    {currency.format(booking.totalPrice)}
                </Typography>
            </Box>
        </Paper>
    );
};

export default BookingPaymentDetailsCard;