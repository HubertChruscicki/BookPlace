export interface ReviewPhoto {
    id: number;
    originalUrl: string;
    thumbnailUrl: string;
}

export interface OfferReview {
    id: number;
    bookingId: number;
    guestId: string;
    guestName: string;
    guestProfilePictureUrl?: string;
    offerId: number;
    rating: number;
    content: string;
    createdAt: string;
    photos: ReviewPhoto[];
}

export type ReviewOrderBy = 'CreatedAt' | 'Rating';

export interface GetOfferReviewsParams {
    OrderBy?: ReviewOrderBy;
    OrderDescending?: boolean;
    PageNumber?: number;
    PageSize?: number;
}

