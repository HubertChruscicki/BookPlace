export interface OfferType {
    id: number;
    name: string;
}

export interface Amenity {
    id: number;
    name: string;
}

export interface OfferPhoto {
    id: number;
    originalUrl: string;
    mediumUrl: string;
    thumbnailUrl: string;
    isCover: boolean;
    sortOrder: number;
}

export interface OfferSummary {
    id: number;
    title: string;
    pricePerNight: number;
    maxGuests: number;
    rooms: number;
    bathrooms: number;
    status: string;
    fullAddress: string;
    coverPhoto: OfferPhoto;
    createdAt: string;
}

export interface GetOffersParams {
    PageNumber?: number;
    PageSize?: number;
    City?: string;
    MinPrice?: number;
    MaxPrice?: number;
    Guests?: number;
    OfferTypeId?: number;
    Amenities?: string;
    CheckInDate?: string;
    CheckOutDate?: string;
}
export interface PageResult<T> {
    items: T[];
    totalPages: number;
    totalItemsCount: number;
    pageNumber: number;
    pageSize: number;
}