import apiClient from './apiClient';
import type { OfferReview, GetOfferReviewsParams } from '../models/ReviewModels';
import type { PageResult } from '../models/PageResultModel';

export const fetchOfferReviews = async (
    offerId: number | string,
    params: GetOfferReviewsParams
): Promise<PageResult<OfferReview>> => {
    const { data } = await apiClient.get<PageResult<OfferReview>>(`/Reviews/offer/${offerId}`, {
        params,
    });

    return data;
};

