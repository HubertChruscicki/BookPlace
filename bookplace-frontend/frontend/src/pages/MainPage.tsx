import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import OffersGrid from "../components/Offer/OffersGrid";
import Footer from "../components/Footer/Footer";
import { OfferCardModel } from "../models/OfferModel";
import {useState} from "react";

const MainPage: React.FC = () => {

    const [offers, setOffers] = useState<OfferCardModel[]>([])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "0px 40px",
            }}
        >
            <Header fullWidth />
            <OffersGrid offers={offers} />
            <Footer />
        </Box>
    );
};

export default MainPage;
