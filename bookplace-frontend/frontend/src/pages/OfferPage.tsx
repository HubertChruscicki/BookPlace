import OfferHeader from "../components/Offer/OfferHeader.tsx";
import {Box, Typography} from "@mui/material";
import OfferPhotoGrid from "../components/Offer/OfferPhotoGrid.tsx";
import OfferInfo from "../components/Offer/OfferInfo.tsx";
import OfferSummary from "../components/Offer/OfferSummary.tsx";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";
import Header from "../components/Header/Header.tsx";
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {colors} from "../theme/colors.ts"
import {useAuth} from "../Auth/useAuth.ts";

const OfferContent = () => {
    const {offer, isLoading, error} = useOffer();
    const [searchParams] = useSearchParams();
    const inParam  = searchParams.get('checkIn');
    const outParam = searchParams.get('checkOut');
    const guestsParm = searchParams.get('guests');
    const [checkIn,  setCheckIn]  = useState<Dayjs | null>(inParam ? dayjs(inParam) : null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(outParam? dayjs(outParam): null);
    const [guestsNumber, setGuestsNumber] = useState<number>(guestsParm? parseInt(guestsParm) : 1);
    const navigate = useNavigate();
    const { auth, openAuthModal } = useAuth()
    const [bookButtonActive, setBookButtonActive] = useState<boolean>(false);


    const goToCheckOut = () => {
        if (error){
            console.error("error handle") //TODO
            return;
        }
        if(checkIn && checkOut && guestsNumber){
            if (!auth.token) {
                openAuthModal('login')
                return
            } else {
                navigate(
                    `/checkout/${offer!.id}` +
                    `?checkIn=${checkIn.format('YYYY-MM-DD')}` +
                    `&checkOut=${checkOut.format('YYYY-MM-DD')}` +
                    `&guests=${guestsNumber}`
                );
            }
        }
    }

    useEffect(() => {

        setBookButtonActive(!(checkIn && checkOut && guestsNumber));
    }, [guestsNumber, checkIn, checkOut]);


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
                p: { xs: "15px", sm: "0px 40px" },
                overflow: "hidden",
                backgroundColor: `${colors.white[800]}`
            }}>
                <Header/>
                <OfferHeader/>
                <OfferPhotoGrid/>
                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    width: "100%",
                    maxWidth: "1220px",
                    justifyContent: "space-between"
                }}>
                    <OfferInfo/>
                    <OfferSummary
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guestsNumber}
                        bookButtonActive={bookButtonActive}
                        onChangeCheckIn={setCheckIn}
                        onChangeCheckOut={setCheckOut}
                        onSetGuestsNumber={setGuestsNumber}
                        onCheckout={()=> goToCheckOut()}
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