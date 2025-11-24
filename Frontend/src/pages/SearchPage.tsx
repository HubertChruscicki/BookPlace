import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useInfiniteOffers } from '../hooks/useOffers'; 
import type { GetOffersParams } from '../models/OfferModels';
import { OfferSortBy } from '../models/OfferModels';
import OfferCard from '../components/common/OfferCard';
import SearchHeader from '../components/features/search/SearchHeader';
import type { FilterValues } from '../components/features/search/FiltersModal';
import React, { useRef, useCallback } from 'react';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params: GetOffersParams = React.useMemo(() => {
        const city = searchParams.get('City');
        const checkInDate = searchParams.get('CheckInDate');
        const checkOutDate = searchParams.get('CheckOutDate');
        const guests = searchParams.get('Guests');
        const pageSize = searchParams.get('PageSize');
        const minPrice = searchParams.get('MinPrice');
        const maxPrice = searchParams.get('MaxPrice');
        const offerTypeId = searchParams.get('OfferTypeId');
        const sortBy = searchParams.get('SortBy');
        const rooms = searchParams.get('Rooms');
        const singleBeds = searchParams.get('SingleBeds');
        const doubleBeds = searchParams.get('DoubleBeds');
        const sofas = searchParams.get('Sofas');
        const bathrooms = searchParams.get('Bathrooms');

        const parsedParams: GetOffersParams = {
            PageNumber: 1, 
            PageSize: pageSize ? parseInt(pageSize, 10) : 12,
        };

        if (city) parsedParams.City = city;
        if (checkInDate) parsedParams.CheckInDate = checkInDate;
        if (checkOutDate) parsedParams.CheckOutDate = checkOutDate;
        if (guests) parsedParams.Guests = parseInt(guests, 10);
        if (offerTypeId) parsedParams.OfferTypeId = parseInt(offerTypeId, 10);
        if (minPrice) parsedParams.MinPrice = parseFloat(minPrice);
        if (maxPrice) parsedParams.MaxPrice = parseFloat(maxPrice);

        if (sortBy) {
            const sortByValue = parseInt(sortBy, 10);
            if (!isNaN(sortByValue) && (sortByValue === OfferSortBy.PriceAsc || sortByValue === OfferSortBy.PriceDesc)) {
                parsedParams.SortBy = sortByValue as OfferSortBy;
            }
        }

        if (rooms) parsedParams.Rooms = parseInt(rooms, 10);
        if (singleBeds) parsedParams.SingleBeds = parseInt(singleBeds, 10);
        if (doubleBeds) parsedParams.DoubleBeds = parseInt(doubleBeds, 10);
        if (sofas) parsedParams.Sofas = parseInt(sofas, 10);
        if (bathrooms) parsedParams.Bathrooms = parseInt(bathrooms, 10);

        const amenities = searchParams.getAll('Amenities');
        if (amenities.length > 0) {
            const parsedAmenities = amenities
                .map(id => parseInt(id, 10))
                .filter(id => !isNaN(id) && id > 0);

            if (parsedAmenities.length > 0) {
                parsedParams.Amenities = parsedAmenities;
            }
        }

        return parsedParams;
    }, [searchParams]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteOffers(params);

    const observer = useRef<IntersectionObserver | null>(null);
    
    const lastOfferRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetchingNextPage) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);


    const currentSortBy = params.SortBy ?? OfferSortBy.PriceAsc;
    const currentCity = params.City;

    const currentFilters: FilterValues = React.useMemo(() => ({
        minPrice: params.MinPrice,
        maxPrice: params.MaxPrice,
        rooms: params.Rooms,
        singleBeds: params.SingleBeds,
        doubleBeds: params.DoubleBeds,
        sofas: params.Sofas,
        bathrooms: params.Bathrooms,
        amenities: params.Amenities,
    }), [params]);

    const handleSortChange = (newSortBy: OfferSortBy) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('SortBy', newSortBy.toString());
        setSearchParams(newParams);
    };

    const handleFiltersChange = (filters: FilterValues) => {
        const newParams = new URLSearchParams(searchParams);
        ['MinPrice', 'MaxPrice', 'Rooms', 'SingleBeds', 'DoubleBeds', 'Sofas', 'Bathrooms', 'Amenities']
            .forEach(key => newParams.delete(key));

        if (filters.minPrice !== undefined) newParams.set('MinPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) newParams.set('MaxPrice', filters.maxPrice.toString());
        if (filters.rooms !== undefined) newParams.set('Rooms', filters.rooms.toString());
        if (filters.singleBeds !== undefined) newParams.set('SingleBeds', filters.singleBeds.toString());
        if (filters.doubleBeds !== undefined) newParams.set('DoubleBeds', filters.doubleBeds.toString());
        if (filters.sofas !== undefined) newParams.set('Sofas', filters.sofas.toString());
        if (filters.bathrooms !== undefined) newParams.set('Bathrooms', filters.bathrooms.toString());

        if (filters.amenities && filters.amenities.length > 0) {
            filters.amenities.forEach(amenityId => {
                newParams.append('Amenities', amenityId.toString());
            });
        }

        setSearchParams(newParams);
    };

    const totalItemsCount = data?.pages[0]?.totalItemsCount || 0;

    return (
        <Box>
            <Box sx={{ width: '100%' }}>
                <SearchHeader
                    totalCount={totalItemsCount}
                    city={currentCity}
                    sortBy={currentSortBy}
                    onSortChange={handleSortChange}
                    onFiltersChange={handleFiltersChange}
                    activeFilters={currentFilters}
                />

                {isLoading && !data ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Alert severity="error">
                        Error loading offers: {error?.message || 'Unknown error'}
                    </Alert>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 3,
                                justifyContent: 'center'
                            }}
                        >
                            {data?.pages.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page.items.map((offer, offerIndex) => {
                                        const isLastElement =
                                            pageIndex === data.pages.length - 1 &&
                                            offerIndex === page.items.length - 1;

                                        return (
                                            <Box
                                                ref={isLastElement ? lastOfferRef : null}
                                                key={offer.id}
                                                sx={{
                                                    flex: '1 1 calc(25% - 24px)',
                                                    minWidth: '300px',
                                                    maxWidth: '400px'
                                                }}
                                            >
                                                <OfferCard
                                                    offer={offer}
                                                    checkInDate={params.CheckInDate}
                                                    checkOutDate={params.CheckOutDate}
                                                    guests={params.Guests}
                                                />
                                            </Box>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </Box>

                        {isFetchingNextPage && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, width: '100%' }}>
                                <CircularProgress size={30} />
                            </Box>
                        )}

                        {!hasNextPage && totalItemsCount > 0 && (
                            <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                                <Typography variant="body2">You've reached the end of the list.</Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default SearchPage;