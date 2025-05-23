
export interface makeReservationModel {
    offer_id: number ;
    start_date: string;
    end_date: string;
    guests_number: number;
}


export interface ReservationInfoModel {
    id: number,
    title: string,
    city: string,
    country: string,
    image: string,
    start_date: string,
    end_date: string,
    status: string
}


