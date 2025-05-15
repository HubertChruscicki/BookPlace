import {colors} from "../theme/colors.ts";
import Header from "../components/Header/Header.tsx";
import {Box, IconButton, styled, Typography} from "@mui/material";
import Footer from "../components/Footer/Footer.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import OfferCheckoutSummary from "../components/Offer/OfferCheckoutSummary.tsx";
import dayjs from "dayjs";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Text = styled(Typography)<{ weight?: string }>(({ weight }) => ({
    fontWeight: weight ?? "400",
    fontSize: "1.3rem",
}));

const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

const CheckoutPageContent: React.FC = () => {
    const {offer, isLoading, error} = useOffer();
    const [search] = useSearchParams();
    const checkIn  = search.get('checkIn');
    const checkOut = search.get('checkOut');
    const guests   = search.get('guests');
    const navigate = useNavigate();
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
                <Box>
                    <Row sx={{mt: 5}}>
                        <IconButton
                            onClick={()=>{navigate(`/offer/${offer?.id}?checkIn=${checkIn}&checkout=${checkOut}`)}}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'action.hover' },
                            }}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <Typography sx={{fontWeight: "bold", fontSize: "2rem"}}>
                            Ask for reservation
                        </Typography>
                    </Row>
                </Box>
                <OfferCheckoutSummary checkIn={dayjs(checkIn)} checkOut={dayjs(checkOut)} />
            </Box>
            <Footer />
        </Box>
    )
};

const CheckoutPage: React.FC = () => {
    return(
        <OfferProvider>
           <CheckoutPageContent/>
        </OfferProvider>
    )
};


export default CheckoutPage;