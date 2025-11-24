import apiClient from './apiClient';
import type {
    GetOffersParams,
    OfferDetail,
    OfferSummary,
    OfferType,
    Amenity,
    GetHostOffersParams,
    HostOfferSummary
} from '../models/OfferModels';
import type { PageResult } from '../models/PageResultModel';

export const fetchOffers = async (
    params: GetOffersParams
): Promise<PageResult<OfferSummary>> => {
    const { data } = await apiClient.get<PageResult<OfferSummary>>('/Offer', {
        params
    });
    return data;
};

export const fetchHostOffers = async (
    params: GetHostOffersParams
): Promise<PageResult<HostOfferSummary>> => {
    const { data } = await apiClient.get<PageResult<HostOfferSummary>>('/Offer/my-offers', {
        params: {
            ...params,
            IncludeArchived: false
        }
    });
    return data;
};

export const fetchOfferDetails = async (id: string | number): Promise<OfferDetail> => {
    const { data } = await apiClient.get<OfferDetail>(`/Offer/${id}`);
    return data;
};

export const fetchOfferTypes = async (): Promise<OfferType[]> => {
    const { data } = await apiClient.get<OfferType[]>('/Offer/types');
    return data;
};

export const fetchAmenities = async (): Promise<Amenity[]> => {
    const { data } = await apiClient.get<Amenity[]>('/Offer/amenities');
    return data;
};