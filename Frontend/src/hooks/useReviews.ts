import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { fetchOfferReviews } from '../api/review.api';
import type { OfferReview, GetOfferReviewsParams } from '../models/ReviewModels';
import type { PageResult } from '../models/PageResultModel';
import { REVIEW_QUERY_KEYS } from '../constants/queryKeys';

interface UseOfferReviewsOptions {
    enabled?: boolean;
}

export const useOfferReviews = (
    offerId: number | string,
    params: GetOfferReviewsParams,
    options?: UseOfferReviewsOptions
) => {
    return useQuery<PageResult<OfferReview>, AxiosError>({
        queryKey: REVIEW_QUERY_KEYS.list(offerId, params),
        queryFn: () => fetchOfferReviews(offerId, params),
        enabled: Boolean(offerId) && (options?.enabled ?? true),
    });
};
