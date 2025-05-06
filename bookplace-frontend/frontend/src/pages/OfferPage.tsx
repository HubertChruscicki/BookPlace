import OfferHeader from "../components/Offer/OfferHeader.tsx";
import {Box, Typography} from "@mui/material";
import OfferPhotoGrid from "../components/Offer/OfferPhotoGrid.tsx";
import OfferInfo from "../components/Offer/OfferInfo.tsx";
import OfferSummary from "../components/Offer/OfferSummary.tsx";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";
import Header from "../components/Header/Header.tsx";
import { useSearchParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";


const OfferContent = () => {
    const {offer, isLoading, error} = useOffer();
    const [searchParams] = useSearchParams();
    const inParam  = searchParams.get('checkIn');
    const outParam = searchParams.get('checkOut');
    const [checkIn,  setCheckIn]  = useState<Dayjs | null>(inParam ? dayjs(inParam) : null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(outParam? dayjs(outParam): null);

    if (isLoading) {
        return null; //TODO SCELETON
    }

    if (error || !offer) {
        return (
            <Box sx={{p: 4}}>
                <Typography variant="h5" color="error   ">
                    {`404 page to implement, ERROR: ${error}`}
                </Typography>
            </Box>
        );
    }

        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: "0px 40px"
            }}>
                <Header/>
                <OfferHeader/>
                <OfferPhotoGrid/>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    maxWidth: "1220px",
                    justifyContent: "space-between"
                }}>
                    <OfferInfo/>
                    <OfferSummary
                        checkIn={checkIn}
                        checkOut={checkOut}
                        onChangeCheckIn={setCheckIn}
                        onChangeCheckOut={setCheckOut}
                    />
                </Box>
            </Box>
        );
}

const OfferPage: React.FC = () => {

    return(
        <OfferProvider>
            <OfferContent/>
        </OfferProvider>
    );
};


export default OfferPage;