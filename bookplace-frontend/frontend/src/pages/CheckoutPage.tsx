import {colors} from "../theme/colors.ts";
import Header from "../components/Header/Header.tsx";
import {Box, Button, IconButton, styled, Typography} from "@mui/material";
import Footer from "../components/Footer/Footer.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import OfferCheckoutSummary from "../components/Offer/Checkout/OfferCheckoutSummary.tsx";
import dayjs from "dayjs";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckoutDetailsBlock from "../components/Offer/Checkout/CheckoutDetailsBlock.tsx";
import PaymentBlock from "../components/Offer/Checkout/PaymentBlock.tsx";
import React from "react";
import CheckoutCancelInfo from "../components/Offer/Checkout/CheckoutCancelInfo.tsx";
import { theme } from "../theme/theme.ts";
import api from "../api/axiosApi.ts";
import {makeReservationModel} from "../models/ReservationModel.ts";
import {useAuth} from "../Auth/useAuth.ts";

const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

const BookButton = styled(Button)({
    backgroundColor: colors.blue[500],
    fontWeight: "600",
    borderRadius: 10,
    fontSize: "1.2rem",
    textTransform: "none",
    height: 50,
    width: 250,
    color: colors.white[900],
    marginBottom: theme.spacing(10),
    marginLeft:   theme.spacing(6),
});



const CheckoutPageContent: React.FC = () => {
    const {offer, isLoading, error} = useOffer();
    const [search] = useSearchParams();
    const checkIn  = search.get('checkIn');
    const checkOut = search.get('checkOut');
    const guests   = search.get('guests');
    const navigate = useNavigate();

    const handleCheckout = async () => {

        if(offer){
            const reservation: makeReservationModel = {
                offer_id:       offer.id,
                start_date:     dayjs(checkIn).format('YYYY-MM-DD'),
                end_date:       dayjs(checkOut).format('YYYY-MM-DD'),
                guests_number:  guests ? parseInt(guests, 10) : 1,
            };
            try {
                await api.post(`/reservations/make-reservation/`, reservation, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                navigate('/myReservations');
            } catch (error) {
                console.error('Error adding offer:', error);
                // setError(error); TODO DO ERROR
            }
        }

    }

    return(
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                p: "0px 40px",
                backgroundColor: `${colors.white[800]}`
            }}
        >
            <Header fullWidth />
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                maxWidth: "1220px",
                justifyContent: "space-between"
            }}>
                <Box sx={{width: "50%"}}>
                    <Row sx={{mt: 5}}>
                        <IconButton
                            onClick={()=>{navigate(`/offer/${offer?.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'action.hover' },
                            }}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <Typography sx={{fontWeight: "bold", fontSize: "2.5rem"}}>
                            Ask for reservation
                        </Typography>
                    </Row>

                    <CheckoutDetailsBlock checkIn={dayjs(checkIn)} checkOut={dayjs(checkOut)} guests={guests ? parseInt(guests) : 1} />
                    <PaymentBlock/>
                    <CheckoutCancelInfo/>

                    <Typography sx={{width: "100%", gap: 3, my: 5, ml: 6, fontSize: "0.8rem"}}>
                        By clicking button below, I do accept the rules of the place,
                        primary rules that guest are supposed to follow, terms of refund and changes of reservation at BookPlace places,
                        that BookPlace can charge me for eventual damage caused to the place of stay,
                        I agree to pay full price of the stay in the object that is shown at the page right now.
                        Payment terms of BookPlace corp.
                    </Typography>


                    {
                        //TODO check czy zlaogowany
                    }
                    <BookButton onClick={()=> handleCheckout()}>
                        Book place
                    </BookButton>
                </Box>
                <OfferCheckoutSummary checkIn={dayjs(checkIn)} checkOut={dayjs(checkOut)} />
            </Box>
            <Footer />
        </Box>
    )
};

//TODO CHECK IF POSSIBLE RESERVATION BY ENDPOINT THEN DISPLAY PAGECONTENT OR ERRROR TODO CHECK LOGGIN BEFORE RESERV
//TODO CHECK DATA CHECKOUT PO CHECKIN JAK NIE TO TERROR
const CheckoutPage: React.FC = () => {
    return(
        <OfferProvider>
           <CheckoutPageContent/>
        </OfferProvider>
    )
};


export default CheckoutPage;