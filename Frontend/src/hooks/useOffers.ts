import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {fetchOffers, fetchAmenities, fetchOfferTypes, fetchOfferDetails} from '../api/offer.api';
import type {GetOffersParams, OfferSummary, Amenity, OfferType, OfferDetail} from '../models/OfferModels';
import { AxiosError } from 'axios';
import type { PageResult } from '../models/PageResultModel';
import { OFFER_QUERY_KEYS } from '../constants/queryKeys';

export const useOffers = (params: GetOffersParams) => {
    return useQuery<PageResult<OfferSummary>, AxiosError>({
        queryKey: OFFER_QUERY_KEYS.list(params),
        queryFn: () => fetchOffers(params),
        placeholderData: keepPreviousData,
    });
};

export const useAmenities = () => {
    return useQuery<Amenity[], AxiosError>({
        queryKey: [...OFFER_QUERY_KEYS.filters(), 'amenities'],
        queryFn: fetchAmenities,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useOfferTypes = () => {
    return useQuery<OfferType[], AxiosError>({
        queryKey: [...OFFER_QUERY_KEYS.filters(), 'types'],
        queryFn: fetchOfferTypes,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useOffer = (id: string | number) => {
    return useQuery<OfferDetail, AxiosError>({
        queryKey: OFFER_QUERY_KEYS.detail(id),
        queryFn: () => fetchOfferDetails(id),
        enabled: !!id, 
    });
};