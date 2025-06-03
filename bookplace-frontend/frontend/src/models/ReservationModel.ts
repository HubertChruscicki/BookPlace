import {OfferReservationInfoModel} from "./OfferModel.ts";

export interface makeReservationModel {
    offer_id: number ;
    start_date: string;
    end_date: string;
    guests_number: number;
}

export interface ReservationInfoModel {
    id: number,
    start_date: string,
    end_date: string,
    status: string
    offer: OfferReservationInfoModel
}

export interface LandlordReservationsModel {
    id: number,
    start_date: string,
    end_date: string,
    status: string
    offer: OfferReservationInfoModel
}


