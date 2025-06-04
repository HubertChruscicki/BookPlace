import {Box, CircularProgress, Typography} from "@mui/material";
import Header from "../components/Header/Header";
import OffersGrid from "../components/Offer/OffersGrid";
import Footer from "../components/Footer/Footer";
import {OfferCardModel} from "../models/OfferModel";
import {useEffect, useState} from "react";
import api from "../api/axiosApi.ts";
import {colors} from "../theme/colors.ts";
import {PaginatedResponse} from "../models/ResponseModel.ts";
import {useInView} from "react-intersection-observer";

const MainPage: React.FC = () => {

    const [offers, setOffers] = useState<OfferCardModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const limit = 12;

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

const loadOffers = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
        const response = await
            api.get<PaginatedResponse<OfferCardModel>>(`/offers/load-offers/?limit=${limit}&offset=${offset}`);
        const newOffers = response.data.results;

        if (newOffers.length < limit) {
            setHasMore(false);
        }

        setOffers(prevOffers => [...prevOffers, ...newOffers]);
        setOffset(prevOffset => prevOffset + limit);
        setError(null);
    } catch (err) {
        console.error("Error during loading offers data:", err);
        setError("Cannot load offers");
    } finally {
        setIsLoading(false);
    }
};

    useEffect(() => {
        loadOffers();
    }, []);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadOffers();
        }
    }, [inView]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "0px 40px",
                overflow: "hidden",
                backgroundColor: `${colors.white[800]}`
            }}
        >
            <Header fullWidth />
            <OffersGrid offers={offers} />
            <Box
                ref={ref}
                sx={{
                    width: '100%',
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 10
                }}
            >
                {isLoading && <CircularProgress />}
                {!hasMore && offers.length > 0 && (
                    <Typography color="text.secondary">
                        No more offers available
                    </Typography>
                )}
                {error && (
                    <Typography color="error">
                        {error}
                    </Typography>
                )}
            </Box>
            <Footer />
        </Box>
    );
};

export default MainPage;
