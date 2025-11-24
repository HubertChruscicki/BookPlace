import { useState, useMemo } from 'react';
import { Box, Typography, Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { format } from 'date-fns';
import { useUserBookings } from '../../hooks/useBooking';
import { useHostOffers } from '../../hooks/useOffers';
import HostCalendar from '../../components/features/host/HostCalendar';

export default function HostCalendarPage() {
    const [selectedOffer, setSelectedOffer] = useState<{ id: number, title: string } | null>(null);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
        start: new Date(),
        end: new Date()
    });

    const { data: offersData, isLoading: offersLoading } = useHostOffers({
        PageNumber: 1,
        PageSize: 100,
        Status: 'Active'
    });

    const offerOptions = useMemo(() => {
        return offersData?.items.map(offer => ({
            id: offer.id,
            title: offer.title
        })) || [];
    }, [offersData]);

    const {
        data: bookingsData,
        isFetching: bookingsFetching
    } = useUserBookings({
        Role: 'host',
        PageNumber: 1,
        PageSize: 100,
        OfferId: selectedOffer?.id,
        DateFrom: format(dateRange.start, 'yyyy-MM-dd'),
        DateTo: format(dateRange.end, 'yyyy-MM-dd')
    });

    const handleDateRangeChange = (start: Date, end: Date) => {
        setDateRange({ start, end });
    };

    const handleEventClick = (id: string) => {
        console.log('Navigate to booking details:', id);
    };

    return (
        <Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={3}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
                    >
                        Calendar
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage availability and view bookings
                    </Typography>
                </Box>

                <Box width={{ xs: '100%', md: 300 }}>
                    <Autocomplete
                        options={offerOptions}
                        getOptionLabel={(option) => option.title}
                        value={selectedOffer}
                        onChange={(_, newValue) => setSelectedOffer(newValue)}
                        loading={offersLoading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Filter by Offer"
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 4, bgcolor: 'white' }
                                }}
                            />
                        )}
                    />
                </Box>
            </Box>

            <Box position="relative">
                {bookingsFetching && (
                    <Box
                        position="absolute"
                        top={20}
                        left={20}
                        zIndex={10}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        bgcolor="rgba(255,255,255,0.8)"
                        p={1}
                        borderRadius={2}
                    >
                        <CircularProgress size={16} />
                        <Typography variant="caption">Updating...</Typography>
                    </Box>
                )}

                <HostCalendar
                    bookings={bookingsData?.items || []}
                    onDateRangeChange={handleDateRangeChange}
                    onEventClick={handleEventClick}
                />
            </Box>
        </Box>
    );
}