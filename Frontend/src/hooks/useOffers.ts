import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchOffers } from '../api/offer.api';
import type { GetOffersParams, OfferSummary, PageResult } from '../models/OfferModels';
import { AxiosError } from 'axios';

const OFFER_QUERY_KEYS = {
    all: ['offers'] as const,
    lists: () => [...OFFER_QUERY_KEYS.all, 'list'] as const,
    list: (params: unknown) => [...OFFER_QUERY_KEYS.lists(), params] as const,
    details: () => [...OFFER_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: number | string) => [...OFFER_QUERY_KEYS.details(), id] as const,
};
export const useOffers = (params: GetOffersParams) => {
    return useQuery<PageResult<OfferSummary>, AxiosError>({
        queryKey: OFFER_QUERY_KEYS.list(params),
        queryFn: () => fetchOffers(params),
        placeholderData: keepPreviousData,
    });
};