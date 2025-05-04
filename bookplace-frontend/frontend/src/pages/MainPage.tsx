import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import OffersGrid from "../components/Offer/OffersGrid";
import Footer from "../components/Footer/Footer";
import {OfferCardModel, OfferModel} from "../models/OfferModel";
import {useEffect, useState} from "react";
import api from "../api/axiosApi.ts";
import {useLocation} from "react-router-dom";

const MainPage: React.FC = () => {

    const [offers, setOffers] = useState<OfferCardModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        api.get("/offers/load-offers/?limit=48&offset=0")
            .then(res => {
                setOffers(res.data.results);
                setError(null);
            })
            .catch(err => {
                console.error("Error during loading offers data:", err)
                setError("Cannot load offers");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

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
