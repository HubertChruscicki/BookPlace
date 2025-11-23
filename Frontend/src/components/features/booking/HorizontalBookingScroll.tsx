import React, { useRef } from 'react';
import {
    Box,
    Typography,
    Alert,
    IconButton,
    Stack,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import BookingCard from "../../common/BookingCard.tsx";
import type {BookingItem} from "../../../models/BookingModels.ts";

interface HorizontalBookingScrollProps {
    title: string;
    bookings: BookingItem[];
    emptyMessage: string;
    maxVisible?: number;
}

const HorizontalBookingScroll: React.FC<HorizontalBookingScrollProps> = ({
    title,
    bookings,
    emptyMessage,
    maxVisible = 3,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const hasOverflow = bookings.length > maxVisible;

    if (bookings.length === 0) {
        return (
            <Box sx={{ mb: 6 }}>
                <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: 'text.primary',
                    }}
                >
                    {title} (0)
                </Typography>
                
                <Alert 
                    severity="info" 
                    sx={{ 
                        borderRadius: 2,
                        backgroundColor: 'rgba(33, 150, 243, 0.05)',
                    }}
                >
                    {emptyMessage}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                    }}
                >
                    {title} ({bookings.length})
                </Typography>
                
                {hasOverflow && (
                    <Stack direction="row" spacing={1}>
                        <IconButton 
                            onClick={scrollLeft}
                            sx={{ 
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton 
                            onClick={scrollRight}
                            sx={{ 
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Stack>
                )}
            </Box>

            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    pb: 1,
                }}
            >
                {bookings.map((booking) => (
                    <Box
                        key={booking.id}
                        sx={{
                            minWidth: 300,
                            maxWidth: 300,
                            flexShrink: 0,
                        }}
                    >
                        <BookingCard booking={booking} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HorizontalBookingScroll;
