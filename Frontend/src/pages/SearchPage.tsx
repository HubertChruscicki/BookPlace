import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useOffers } from '../hooks/useOffers';
import type { GetOffersParams } from '../models/OfferModels';
import React from 'react';

const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const params: GetOffersParams = React.useMemo(() => {
        const city = searchParams.get('City');
        const checkInDate = searchParams.get('CheckInDate');
        const checkOutDate = searchParams.get('CheckOutDate'); 
        const guests = searchParams.get('Guests');
        const pageNumber = searchParams.get('PageNumber');
        const pageSize = searchParams.get('PageSize');

        const parsedParams: GetOffersParams = {
            PageNumber: pageNumber ? parseInt(pageNumber, 10) : 1,
            PageSize: pageSize ? parseInt(pageSize, 10) : 12,
        };

        if (city) parsedParams.City = city;
        if (checkInDate) parsedParams.CheckInDate = checkInDate;
        if (checkOutDate) parsedParams.CheckOutDate = checkOutDate; 
        if (guests) parsedParams.Guests = parseInt(guests, 10);

        return parsedParams;
    }, [searchParams]);

    const { data, isLoading, isError, error } = useOffers(params);

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search Results
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Alert severity="error">
                    Error loading offers: {error?.message || 'Unknown error'}
                </Alert>
            )}

            {data && (
                <Box>
                    <Typography variant="h6">
                        Found {data.totalItemsCount} offers
                    </Typography>
                    <pre>
                        {JSON.stringify(data.items, null, 2)}
                    </pre>
                </Box>
            )}
        </Box>
    );
};

export default SearchPage;