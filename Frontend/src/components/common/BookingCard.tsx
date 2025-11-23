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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { BookingItem } from '../../models/BookingModels';

interface BookingCardProps {
    booking: BookingItem;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Confirmed':
            return 'success';
        case 'Pending':
            return 'warning';
        case 'Completed':
            return 'info';
        case 'CancelledByHost':
        case 'CancelledByGuest':
            return 'error';
        default:
            return 'default';
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
        // TODO: Navigate to chat when implemented
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
                        right: 12,
                    }}
                >
                    <Chip
                        label={getStatusLabel(booking.status)}
                        color={getStatusColor(booking.status) as any}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                        }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {booking.offer.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon 
                        sx={{ 
                            fontSize: 16, 
                            color: 'text.secondary', 
                            mr: 0.5 
                        }} 
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                    >
                        {location}
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon 
                            sx={{ 
                                fontSize: 16, 
                                color: 'text.secondary', 
                                mr: 0.5 
                            }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                        Guests: {booking.numberOfGuests}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 2,
                    }}
                >
                    {booking.totalPrice.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })}
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        onClick={handleViewDetails}
                        sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        View Details
                    </Button>
                    
                    {(booking.status === 'Confirmed' || booking.status === 'Pending') && (
                        <Button
                            variant="outlined"
                            onClick={handleChatWithHost}
                            sx={{
                                minWidth: 'auto',
                                p: 1,
                                borderRadius: 2,
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
