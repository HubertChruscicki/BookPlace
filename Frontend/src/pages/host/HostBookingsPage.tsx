import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUserBookings } from '../../hooks/useBooking';
import { fetchUserBookings } from '../../api/booking.api';
import type { GetUserBookingsResponse } from '../../models/BookingModels';
import type { HostBooking, HostBookingFilters } from '../../models/HostModels';

import HostBookingFiltersComponent from "../../components/features/host/HostBookingFilters";
import HostBookingListItem from "../../components/features/host/HostBookingListItem";
import PaginationControls from "../../components/common/PaginationControls";

const API_BASE_URL = 'http://localhost:8080/';
const PAGE_SIZE = 6;

const mapApiStatusToUiStatus = (apiStatus: string, checkOutDate: string): HostBooking['status'] => {
    if (apiStatus === 'Cancelled') return 'canceled';
    if (apiStatus === 'Completed') return 'past';
    if (apiStatus === 'Confirmed') {
        const now = new Date();
        const end = new Date(checkOutDate);
        return end < now ? 'past' : 'upcoming';
    }
    return 'active';
};

const mapUiStatusToApiStatus = (uiStatus: HostBookingFilters['status']): string | undefined => {
    switch (uiStatus) {
        case 'upcoming': return 'Confirmed';
        case 'past': return 'Completed';
        case 'canceled': return 'Cancelled';
        case 'all': return undefined;
        default: return undefined;
    }
}

const transformBookingData = (data: GetUserBookingsResponse | undefined): HostBooking[] => {
    if (!data?.items) return [];

    return data.items.map((item) => ({
        id: item.id.toString(),
        offerId: item.offerId.toString(),
        offerTitle: item.offer.title,
        offerThumbnailUrl: item.offer.coverPhotoUrl
            ? (item.offer.coverPhotoUrl.startsWith('http') ? item.offer.coverPhotoUrl : `${API_BASE_URL}${item.offer.coverPhotoUrl}`)
            : '',
        guestName: item.guest.name,
        guestEmail: '', 
        guestProfilePictureUrl: item.guest.avatarUrl || undefined,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        totalPrice: item.totalPrice,
        status: mapApiStatusToUiStatus(item.status, item.checkOutDate),
        guestsCount: item.numberOfGuests,
        paymentStatus: item.status === 'Cancelled' ? 'refunded' : 'paid',
        createdAt: item.createdAt,
    }));
};

export default function HostBookingsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [pageNumber, setPageNumber] = useState(1);

    const [filters, setFilters] = useState<HostBookingFilters>({
        status: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
    });

    const {
        data: bookingData,
        isLoading,
        isError,
        isFetching,
        isPlaceholderData,
    } = useUserBookings({
        Role: 'host',
        PageNumber: pageNumber,
        PageSize: PAGE_SIZE,
        Status: mapUiStatusToApiStatus(filters.status),
    });

    useEffect(() => {
        const totalPages = bookingData?.totalPages || 0;

        if (!isPlaceholderData && pageNumber < totalPages) {
            const nextPage = pageNumber + 1;
            const apiStatus = mapUiStatusToApiStatus(filters.status);

            queryClient.prefetchQuery({
                queryKey: ['bookings', {
                    Role: 'host',
                    PageNumber: nextPage,
                    PageSize: PAGE_SIZE,
                    Status: apiStatus
                }],
                queryFn: () => fetchUserBookings({
                    Role: 'host',
                    PageNumber: nextPage,
                    PageSize: PAGE_SIZE,
                    Status: apiStatus
                }),
            });
        }
    }, [bookingData, isPlaceholderData, pageNumber, queryClient, filters.status]);

    const filteredBookings: HostBooking[] = useMemo(() => {
        const bookings = transformBookingData(bookingData);
        bookings.sort((a, b) => {
            const dateA = new Date(a.checkInDate).getTime();
            const dateB = new Date(b.checkInDate).getTime();
            if (filters.sortOrder === 'asc') return dateA - dateB;
            return dateB - dateA;
        });
        return bookings;
    }, [bookingData, filters.sortOrder]);

    const handleStatusChange = (_event: any, newStatus: string | null) => {
        if (newStatus !== null) {
            setFilters(prev => ({ ...prev, status: newStatus as HostBookingFilters['status'] }));
            setPageNumber(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const gridColumns = '1fr 2.5fr 1.8fr 0.8fr 0.8fr 1.3fr 1.8fr 2fr';

    if (isLoading && !bookingData) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ borderRadius: 3, mt: 4 }}>
                Wystąpił błąd podczas ładowania rezerwacji. Spróbuj odświeżyć stronę.
            </Alert>
        );
    }

    const totalPages = bookingData?.totalPages || 1;
    const totalItemsCount = bookingData?.totalItemsCount || 0;

    return (
        <Box>
            <HostBookingFiltersComponent
                filters={filters}
                onStatusChange={handleStatusChange}
            />

            {isFetching && !isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="caption" sx={{ ml: 1 }}>Updating...</Typography>
                </Box>
            )}

            {filteredBookings.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                    No bookings found in this category.
                </Alert>
            ) : (
                <Box>
                    <Box sx={{
                        display: { xs: 'none', md: 'grid' },
                        gridTemplateColumns: gridColumns,
                        py: 1.5,
                        mb: 1,
                        borderBottom: '2px solid',
                        borderColor: 'grey.300',
                        fontWeight: 700,
                        color: 'text.secondary',
                        gap: 2,
                        px: 2,
                    }}>
                        <Typography variant="body2">Image</Typography>
                        <Typography variant="body2">Offer</Typography>
                        <Typography variant="body2">Dates</Typography>
                        <Typography variant="body2">Guests</Typography>
                        <Typography variant="body2">Price</Typography>
                        <Typography variant="body2">Status</Typography>
                        <Typography variant="body2">Guest</Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>Actions</Typography>
                    </Box>

                    {filteredBookings.map((booking) => (
                        <HostBookingListItem
                            key={booking.id}
                            booking={booking}
                            navigate={navigate}
                        />
                    ))}

                    <PaginationControls
                        pageNumber={pageNumber}
                        totalPages={totalPages}
                        totalItemsCount={totalItemsCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={handlePageChange}
                        isLoading={isFetching}
                    />
                </Box>
            )}
        </Box>
    );
}