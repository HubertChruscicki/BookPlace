import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';

import { useHostOffers } from '../../hooks/useOffers';
import { fetchHostOffers } from '../../api/offer.api';

import HostOfferCard from '../../components/features/host/HostOfferCard';
import PaginationControls from '../../components/common/PaginationControls';
import {theme} from "../../theme.ts";

const PAGE_SIZE = 8;

export default function HostOffersPage() {
    const queryClient = useQueryClient();

    const [pageNumber, setPageNumber] = useState(1);
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

    const {
        data: offersData,
        isLoading,
        isError,
        isFetching,
        isPlaceholderData
    } = useHostOffers({
        PageNumber: pageNumber,
        PageSize: PAGE_SIZE,
        Status: status,
        IncludeArchived: false
    });

    useEffect(() => {
        const totalPages = offersData?.totalPages || 0;

        if (!isPlaceholderData && pageNumber < totalPages) {
            const nextPage = pageNumber + 1;
            queryClient.prefetchQuery({
                queryKey: ['host-offers', {
                    PageNumber: nextPage,
                    PageSize: PAGE_SIZE,
                    Status: status,
                    IncludeArchived: false
                }],
                queryFn: () => fetchHostOffers({
                    PageNumber: nextPage,
                    PageSize: PAGE_SIZE,
                    Status: status,
                    IncludeArchived: false
                }),
            });
        }
    }, [offersData, isPlaceholderData, pageNumber, status, queryClient]);

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newStatus: 'Active' | 'Inactive' | null) => {
        if (newStatus !== null) {
            setStatus(newStatus);
            setPageNumber(1);
        }
    };

    const handleAddOffer = () => console.log('Add Offer');
    const handleEditOffer = (id: number) => console.log('Edit', id);
    const handleViewOffer = (id: number) => console.log('View', id);
    const handleReviews = (id: number) => console.log('Reviews', id);

    if (isLoading && !offersData) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (isError) {
        return <Alert severity="error" sx={{ mt: 4 }}>Failed to load offers.</Alert>;
    }

    const items = offersData?.items || [];
    const totalPages = offersData?.totalPages || 1;
    const totalItemsCount = offersData?.totalItemsCount || 0;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center"  flexWrap="wrap" gap={2}>

                <Box
                    sx={{ my: 3 }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, fontSize: "1.4rem", color: 'text.primary', mb: 1 }}
                    >
                        My Offers
                    </Typography>
                    <Typography
                        sx={{ fontWeight: 500, fontSize: "1rem", color: theme.palette.text.secondary, mb: 1 }}>
                        Manage your properties and listings
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddOffer}
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        boxShadow: 'none'
                    }}
                >
                    Add New Offer
                </Button>
            </Box>

            <Box mb={4}>
                <ToggleButtonGroup
                    value={status}
                    exclusive
                    onChange={handleStatusChange}
                    sx={{
                        gap: 1,
                        '& .MuiToggleButtonGroup-grouped': {
                            border: 0,
                            borderRadius: 25,
                            '&:not(:first-of-type)': { borderRadius: 25 },
                            '&:first-of-type': { borderRadius: 25 },
                        }
                    }}
                >
                    <ToggleButton
                        value="Active"
                        sx={{
                            px: 3,
                            py: 0.8,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: status === 'Active' ? 'primary.main' : 'grey.100',
                            color: status === 'Active' ? 'white' : 'text.secondary',
                            '&:hover': {
                                bgcolor: status === 'Active' ? 'primary.dark' : 'grey.200',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }
                        }}
                    >
                        Active
                    </ToggleButton>
                    <ToggleButton
                        value="Inactive"
                        sx={{
                            px: 3,
                            py: 0.8,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: status === 'Inactive' ? 'primary.main' : 'grey.100',
                            color: status === 'Inactive' ? 'white' : 'text.secondary',
                            '&:hover': {
                                bgcolor: status === 'Inactive' ? 'primary.dark' : 'grey.200',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }
                        }}
                    >
                        Inactive
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {isFetching && !isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="caption" sx={{ ml: 1 }}>Updating list...</Typography>
                </Box>
            )}

            {items.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                    No {status.toLowerCase()} offers found.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {items.map((offer) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={offer.id}>
                            <HostOfferCard
                                offer={offer}
                                onEdit={handleEditOffer}
                                onView={handleViewOffer}
                                onReviews={handleReviews}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <PaginationControls
                pageNumber={pageNumber}
                totalPages={totalPages}
                totalItemsCount={totalItemsCount}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                isLoading={isFetching}
            />
        </Box>
    );
}