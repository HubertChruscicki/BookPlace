export interface Landlord {
  id: number;
  first_name: string;
}

export interface OfferType {
  id: number;
  name: string;
}

export interface OfferDetails {
  rooms: number | null;
  beds: number | null;
  double_beds: number | null;
  sofa_beds: number | null;
}

export interface OfferAmenities {
  "private_bathroom": boolean,
  "kitchen": boolean,
  "wifi": boolean,
  "tv": boolean,
  "fridge_in_room": boolean,
  "air_conditioning": boolean,
  "smoking_allowed": boolean,
  "pets_allowed": boolean,
  "parking": boolean,
  "swimming_pool": boolean,
  "sauna": boolean,
  "jacuzzi": boolean
}

export interface OfferLocation {
  country: string;
  city: string;
  address: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface OfferImage {
  id?: number;
  is_main: boolean;
  image: string;
}



export interface OfferModel {
  id: number ;
  landlord_id: Landlord;
  offer_type: number | null;
  title: string;
  description: string;
  price_per_night: number | null;
  max_guests: number | null;
  is_active: boolean;
  amenities: OfferAmenities;
  details: OfferDetails;
  location: OfferLocation;
  images: OfferImage[];
}

export interface OfferCardModel {
  id: number;
  title: string;
  type: string;
  price_per_night: number;
  rating: number;
  city: string;
  country: string;
  img_url: string;
}

export interface OfferReservationInfoModel {
  id: number;
  title: string;
  city: string;
  country: string;
  img_url: string;
}
