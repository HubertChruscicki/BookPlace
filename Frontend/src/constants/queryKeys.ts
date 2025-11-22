export const OFFER_QUERY_KEYS = {
    all: ['offers'] as const,
    list: (params: unknown) => [...OFFER_QUERY_KEYS.all, 'list', params] as const,
    detail: (id: number | string) => [...OFFER_QUERY_KEYS.all, 'detail', id] as const,
    filters: () => [...OFFER_QUERY_KEYS.all, 'filters'] as const,
};

export const REVIEW_QUERY_KEYS = {
    all: ['reviews'] as const,
    list: (offerId: number | string, params: unknown) => [...REVIEW_QUERY_KEYS.all, offerId, params] as const,
};

export const BOOKING_QUERY_KEYS = {
    all: ['bookings'] as const,
    detail: (offerId: number | string, params: unknown) => [...BOOKING_QUERY_KEYS.all, offerId, 'detail', params] as const,
    create: () => [...BOOKING_QUERY_KEYS.all, 'create'] as const,
};
