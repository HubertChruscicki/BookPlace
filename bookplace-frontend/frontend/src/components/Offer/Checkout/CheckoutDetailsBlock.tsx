import {Box, styled, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";
import React from "react";
import {Dayjs} from "dayjs";
import Divider from "@mui/material/Divider";
import CheckoutOfferDetail from "./CheckoutOfferDetail.tsx";


const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

interface CheckoutDetailsBlockProps {
    checkIn: Dayjs;
    checkOut: Dayjs;
    guests: number;
}

const CheckoutDetailsBlock: React.FC<CheckoutDetailsBlockProps> = ({checkIn, checkOut, guests}) => {
    return(
        <Box sx={{display: "flex", flexDirection: "column", width: "100%", gap: 3, my: 5, ml: 6}}>
            <Typography sx={{fontWeight: "700", fontSize: "1.8rem"}}>
                Place details
            </Typography>
            <CheckoutOfferDetail placeholder="Dates" detail={`${checkIn.format('DD.MM-YY')} - ${checkOut.format('DD.MM.YY')}`} onButtonClick={()=>{}} />
            <CheckoutOfferDetail placeholder="Guests" detail={`${guests} guests`} onButtonClick={()=>{}} />
            <Divider orientation="horizontal"
                     sx={{my: 1, borderTop: "0.005px solid lightgrey",}}
            />
        </Box>

    )
};


export default CheckoutDetailsBlock;