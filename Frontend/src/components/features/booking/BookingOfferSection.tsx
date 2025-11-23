import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Grid, Divider, Stack, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { BookingItem } from '../../../models/BookingModels';
import dayjs from 'dayjs';

interface BookingOfferSectionProps {
    booking: BookingItem;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Confirmed': return 'success';
        case 'Pending': return 'warning';
        case 'Completed': return 'default';
        case 'CancelledByHost':
        case 'CancelledByGuest': return 'error';
        default: return 'default';
    }
};

const formatDate = (dateString: string) => {
    return dayjs(dateString).format('ddd, MMM D, YYYY');
};

const formatTime = (isCheckIn: boolean) => {
    return isCheckIn ? 'After 3:00 PM' : 'Before 11:00 AM';
};

const BookingOfferSection: React.FC<BookingOfferSectionProps> = ({ booking }) => {
    const { offer } = booking;

    const imageUrl = offer.coverPhotoUrl.startsWith('http')
        ? offer.coverPhotoUrl
        : `http://localhost:8080/${offer.coverPhotoUrl}`;

    const offerPath = `/offer/${offer.id}`;

    return (
        <Paper
            elevation={4}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Grid container sx={{ minHeight: 400, flex: 1 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            height: { xs: 200, md: '100%' },
                            minHeight: { xs: 200, md: 400 },
                            bgcolor: 'grey.200',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            component={Link}
                            to={offerPath}
                            sx={{ flex: 1, minHeight: { xs: 200, md: 400 }, cursor: 'pointer', textDecoration: 'none' }}
                        >
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={offer.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                        <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status) as any}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                fontWeight: 700,
                                boxShadow: 2,
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ p: 3 }}>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                {offer.offerType}
                            </Typography>

                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 0.5 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    component={Link}
                                    to={offerPath}
                                    sx={{
                                        flexGrow: 1,
                                        mr: 2,
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        '&:hover': {
                                            color: 'primary.main',
                                        }
                                    }}
                                >
                                    {offer.title}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    to={offerPath}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        borderRadius: 25,
                                    }}
                                >
                                    View Offer
                                </Button>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                                <LocationOnIcon fontSize="small" color="primary" />
                                <Typography variant="body2" color="text.primary" fontWeight={500}>
                                    {offer.addressCity}, {offer.addressCountry}
                                </Typography>
                            </Stack>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Trip details
                                </Typography>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <CalendarTodayIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Check-in</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatDate(booking.checkInDate)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">{formatTime(true)}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <CalendarTodayIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Check-out</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatDate(booking.checkOutDate)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">{formatTime(false)}</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Reservation info
                                </Typography>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <PersonIcon color="primary" fontSize="small" />
                                        <Typography variant="body2" fontWeight={600}>
                                            {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BookingOfferSection;