import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Alert,
    CircularProgress,
    Button,
    Stack,
    IconButton,
    Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBookingDetails } from '../../hooks/useBooking.ts';
import BookingOfferSection from '../../components/features/booking/BookingOfferSection.tsx';
import BookingHostSection from '../../components/features/booking/BookingHostSection.tsx';
import BookingMapWidget from '../../components/features/booking/BookingMapWidget.tsx';
import BookingCancellationSection from '../../components/features/booking/BookingCancellationSection.tsx';
import BookingPaymentDetailsCard from '../../components/features/booking/BookingPaymentDetailsCard.tsx';

const BookingDetailsPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { data: booking, isLoading, isError } = useBookingDetails(bookingId || '');

    const handleBackToBookings = () => {
        navigate('/my-bookings');
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !booking) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    Failed to load reservation details.
                </Alert>
                <Button onClick={handleBackToBookings} variant="outlined">
                    Back to bookings
                </Button>
            </Container>
        );
    }

    const canCancel = booking.status === 'Confirmed' || booking.status === 'Pending';

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                    onClick={handleBackToBookings}
                    size="small"
                    sx={{
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 2,
                    }}
                >
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        Reservation details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Reference code: #{booking.id}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>

                        <BookingOfferSection booking={booking} />
                        <BookingPaymentDetailsCard booking={booking} />
                        <BookingCancellationSection canCancel={canCancel} />

                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                Need help with this reservation?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                                Contact our support team if you have any issues.
                            </Typography>
                            <Button
                                variant="text"
                                sx={{
                                    p: 0,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                }}
                            >
                                Visit Help Center
                            </Button>
                        </Paper>

                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
                        <BookingMapWidget
                            offer={booking.offer}
                        />

                        <BookingHostSection host={booking.host} />

                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default BookingDetailsPage;