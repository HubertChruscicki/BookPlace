import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Stack,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    LocationOn as LocationIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { BookingItem } from '../../models/BookingModels';

interface BookingCardProps {
    booking: BookingItem;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Confirmed': return 'success';
        case 'Pending': return 'warning';
        case 'Completed': return 'info';
        case 'CancelledByHost':
        case 'CancelledByGuest': return 'error';
        default: return 'default';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'Confirmed':
            return 'Confirmed';
        case 'Pending':
            return 'Pending';
        case 'Completed':
            return 'Completed';
        case 'CancelledByHost':
            return 'Cancelled by host';
        case 'CancelledByGuest':
            return 'Cancelled by guest';
        default:
            return status || 'Unknown';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/my-bookings/${booking.id}`);
    };

    const handleChatWithHost = () => {
        console.log('Navigate to chat with host');
    };

    const location = [booking.offer.addressCity, booking.offer.addressCountry]
        .filter(Boolean)
        .join(', ');

    const imageUrl = booking.offer.coverPhotoUrl?.startsWith('http')
        ? booking.offer.coverPhotoUrl
        : `http://localhost:8080/${booking.offer.coverPhotoUrl}`;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="160"
                    image={imageUrl}
                    alt={booking.offer.title}
                    sx={{
                        objectFit: 'cover',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                    }}
                >
                    <Chip
                        label={getStatusLabel(booking.status)}
                        color={getStatusColor(booking.status) as any}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            borderRadius: 20,
                            boxShadow: 1,
                        }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        mb: 1,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {booking.offer.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1.5,
                    }}
                >
                    <LocationIcon sx={{fontSize: 18, color: 'primary.main'}}/>
                    {location}
                </Typography>

                <Stack spacing={1} sx={{ mb: 2, gap: 0.5 }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <PeopleIcon sx={{fontSize: 18, color: 'text.secondary'}}/>
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 500}}>
                            {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <CalendarIcon sx={{fontSize: 18, color: 'text.secondary'}}/>
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 500}}>
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </Typography>
                    </Box>
                </Stack>

                <Typography
                    variant="h5"
                    component="span"
                    sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        mt: 'auto',
                        mb: 1.5,
                    }}
                >
                    {booking.totalPrice.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                    })}
                </Typography>


                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        onClick={handleViewDetails}
                        size="medium"
                        sx={{
                            borderRadius: 25,
                            px: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                            flexGrow: 1,
                            minHeight: 40,
                        }}
                    >
                        View Details
                    </Button>

                    {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                        <Button
                            variant="outlined"
                            onClick={handleChatWithHost}
                            size="medium" 
                            sx={{
                                minWidth: 40, 
                                height: 40, 
                                p: 0,
                                borderRadius: '50%', 
                                textTransform: 'none',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ChatIcon fontSize="small" />
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default BookingCard;