import React, { useMemo } from 'react';
import {
    Card,
    Button,
    Chip,
    Avatar,
    Stack,
    CardMedia,
    Grid,
    Box,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Chat, CalendarToday, People, Phone } from '@mui/icons-material';
import type {HostBooking} from "../../../models/HostModels.ts";

interface HostBookingListItemProps {
    booking: HostBooking;
    navigate: Function;
}

const HostBookingListItem: React.FC<HostBookingListItemProps> = ({ booking, navigate }) => {

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const iconButtonSize = 40;
    const buttonHeight = 40;
    const buttonWidth = 100;

    // --- UI Logic ---

    const statusColor = useMemo(() => {
        switch (booking.status) {
            case 'upcoming': return 'success';
            case 'past': return 'default';
            case 'canceled': return 'error';
            default: return 'default';
        }
    }, [booking.status]);

    const getStatusLabel = (status: HostBooking['status']) => {
        switch (status) {
            case 'upcoming': return 'Upcoming';
            case 'past': return 'Completed';
            case 'canceled': return 'Canceled';
            default: return 'Unknown';
        }
    };

    const formatDateRange = (checkIn: string, checkOut: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        };
        const start = new Date(checkIn).toLocaleDateString('en-GB', options);
        const end = new Date(checkOut).toLocaleDateString('en-GB', options);
        return `${start} - ${end}`;
    };

    const getImageUrl = () => {
        if (booking.offerThumbnailUrl) {
            return booking.offerThumbnailUrl;
        }
        return 'http://localhost:8080/uploads/offers/2/offers_2_photo_2_1762824858_thumb.jpg';
    };

    const isUpcoming = booking.status === 'upcoming';

    const handleViewDetails = () => {
        navigate(`/host/bookings/${booking.id}`);
    };

    const handleMessage = () => {
        console.log('Open chat for booking:', booking.id);
    };

    const handleCall = () => {
        console.log('Call guest:', booking.guestName);
    };

    if (!isDesktop) {
        return (
            <Card
                variant="outlined"
                elevation={2}
                sx={{
                    borderRadius: 3,
                    mb: 2,
                    p: 2,
                    borderColor: 'grey.200',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <CardMedia
                        component="img"
                        height="60"
                        image={getImageUrl()}
                        alt={booking.offerTitle}
                        sx={{ width: 80, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {booking.offerTitle}
                    </Typography>
                </Stack>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip
                        label={getStatusLabel(booking.status)}
                        color={statusColor as any}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 15 }}
                    />
                </Box>

                <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 7 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 5 }}>
                        <Stack direction="row" justifyContent="flex-end" spacing={2} alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                    {booking.guestsCount}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                                {booking.totalPrice.toLocaleString('en-US')} PLN
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.500', fontSize: '0.875rem', color: 'white' }}>
                            {booking.guestName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {booking.guestName}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        {isUpcoming && (
                            <>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleCall}
                                    sx={{ borderRadius: '50%', width: 36, height: 36, minWidth: 36, p: 0, flexShrink: 0, bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}
                                >
                                    <Phone fontSize="small" />
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleMessage}
                                    sx={{ borderRadius: '50%', width: 36, height: 36, minWidth: 36, p: 0, flexShrink: 0 }}
                                >
                                    <Chat fontSize="small" />
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleViewDetails}
                            sx={{ borderRadius: 25, textTransform: 'none', fontWeight: 700, height: 36 }}
                        >
                            Details
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            elevation={2}
            sx={{
                borderRadius: 3,
                mb: 2,
                p: 2,
                borderColor: 'grey.200',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { backgroundColor: 'grey.50', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' },
            }}
        >
            <Grid container alignItems="center" spacing={2}>
                <Grid size={{ md: 1 }}>
                    <CardMedia
                        component="img"
                        height="60"
                        image={getImageUrl()}
                        alt={booking.offerTitle}
                        sx={{ width: 80, borderRadius: 1.5, objectFit: 'cover' }}
                    />
                </Grid>
                <Grid size={{ md: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {booking.offerTitle}
                    </Typography>
                </Grid>
                <Grid size={{ md: 1.8 }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {formatDateRange(booking.checkInDate, booking.checkOutDate)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ md: 0.8 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {booking.guestsCount}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ md: 0.8 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {booking.totalPrice.toLocaleString('en-US')} PLN
                    </Typography>
                </Grid>
                <Grid size={{ md: 1.3 }} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip
                        label={getStatusLabel(booking.status)}
                        color={statusColor as any}
                        size="medium"
                        sx={{ fontWeight: 700, borderRadius: 20 }}
                    />
                </Grid>
                <Grid size={{ md: 1.8 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.500', fontSize: '1rem', color: 'white' }}>
                            {booking.guestName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{booking.guestName}</Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={{ md: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {isUpcoming && (
                            <>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleCall}
                                    sx={{ borderRadius: '50%', width: iconButtonSize, height: iconButtonSize, minWidth: iconButtonSize, p: 0, flexShrink: 0, bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}
                                >
                                    <Phone fontSize="small" />
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleMessage}
                                    sx={{ borderRadius: '50%', width: iconButtonSize, height: iconButtonSize, minWidth: iconButtonSize, p: 0, flexShrink: 0 }}
                                >
                                    <Chat fontSize="small" />
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={handleViewDetails}
                            sx={{ borderRadius: 25, textTransform: 'none', fontWeight: 700, minHeight: buttonHeight, width: buttonWidth }}
                        >
                            Details
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
};

export default HostBookingListItem;