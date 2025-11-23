import type {OfferHost} from "./HostModel.ts";

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
    singleBeds: number;
    doubleBeds: number;
    sofas: number;
    bathrooms: number;
    status: string;
    addressStreet: string;
    addressCity: string;
    addressZipCode: string;
    addressCountry: string;
    addressLatitude: number;
    addressLongitude: number;
    fullAddress: string;
    offerType: OfferType;
    amenities: Amenity[];
    coverPhoto: OfferPhoto;
    createdAt: string;
    updatedAt: string;
}
// @ts-ignore: TypeScript enum compatibility issue with erasableSyntaxOnly
export enum OfferSortBy {
    PriceAsc = 0,
    PriceDesc = 1
}

export interface GetOffersParams {
    PageNumber?: number;
    PageSize?: number;
    City?: string;
    MinPrice?: number;
    MaxPrice?: number;
    Guests?: number;
    OfferTypeId?: number;
    Amenities?: number[];
    CheckInDate?: string;
    CheckOutDate?: string;
    SortBy?: OfferSortBy;
    Rooms?: number;
    SingleBeds?: number;
    DoubleBeds?: number;
    Sofas?: number;
    Bathrooms?: number;
}

export interface OfferDetail {
    id: number;
    title: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    rooms: number;
    bathrooms: number;
    singleBeds: number;
    doubleBeds: number;
    sofas?: number;
    addressCity: string;
    addressCountry: string;
    addressLatitude: number;
    addressLongitude: number;
    fullAddress: string;
    amenities: Amenity[];
    photos: OfferPhoto[];
    offerType?: OfferType;
    rating?: number;
    reviewsCount?: number;
    host?: OfferHost;
}