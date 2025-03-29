import OfferHeader from "../components/Offer/OfferHeader.tsx";
import {Box, Typography} from "@mui/material";
import OfferPhotoGrid from "../components/Offer/OfferPhotoGrid.tsx";
import OfferInfo from "../components/Offer/OfferInfo.tsx";
import OfferSummary from "../components/Offer/OfferSummary.tsx";
import {OfferProvider, useOffer} from "../components/Offer/OfferContext.tsx";

const OfferContent = () => {
    const {offer, isLoading, error} = useOffer();

    if (isLoading) {
        return null; //TODO SCELETON
    }

    if (error || !offer) {
        return (
            <Box sx={{p: 4}}>
                <Typography variant="h5" color="error">
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
                    <OfferSummary/>
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