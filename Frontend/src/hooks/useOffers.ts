import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {fetchOffers, fetchAmenities, fetchOfferTypes, fetchOfferDetails} from '../api/offer.api';
import type {GetOffersParams, OfferSummary, Amenity, OfferType, OfferDetail} from '../models/OfferModels';
import { AxiosError } from 'axios';
import type { PageResult } from '../models/PageResultModel';

const OFFER_QUERY_KEYS = {
    all: ['offers'] as const,
    lists: () => [...OFFER_QUERY_KEYS.all, 'list'] as const,
    list: (params: unknown) => [...OFFER_QUERY_KEYS.lists(), params] as const,
    details: () => [...OFFER_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number | string) => [...OFFER_QUERY_KEYS.details(), id] as const,
    amenities: () => [...OFFER_QUERY_KEYS.all, 'amenities'] as const,
    types: () => [...OFFER_QUERY_KEYS.all, 'types'] as const,
};

export const useOffers = (params: GetOffersParams) => {
    return useQuery<PageResult<OfferSummary>, AxiosError>({
        queryKey: OFFER_QUERY_KEYS.list(params),
        queryFn: () => fetchOffers(params),
        placeholderData: keepPreviousData,
    });
};

export const useAmenities = () => {
    return useQuery<Amenity[], AxiosError>({
        queryKey: OFFER_QUERY_KEYS.amenities(),
        queryFn: fetchAmenities,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useOfferTypes = () => {
    return useQuery<OfferType[], AxiosError>({
        queryKey: OFFER_QUERY_KEYS.types(),
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