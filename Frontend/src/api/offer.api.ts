import apiClient from './apiClient';
import type {
    Amenity,
    GetOffersParams,
    OfferSummary, OfferType
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
export const fetchOfferTypes = async (): Promise<OfferType[]> => {
    const { data } = await apiClient.get<OfferType[]>('/Offer/types');
    return data;
};
export const fetchAmenities = async (): Promise<Amenity[]> => {
    const { data } = await apiClient.get<Amenity[]>('/Offer/amenities');
    return data;
};