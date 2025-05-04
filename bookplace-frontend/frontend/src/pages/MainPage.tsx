import { Box } from "@mui/material";
import Header from "../components/Header/Header";
import OffersGrid from "../components/Offer/OffersGrid";
import Footer from "../components/Footer/Footer";
import { OfferCardModel } from "../models/OfferModel";

const MainPage: React.FC = () => {
    // przykładowa tablica ofert
    const offers: OfferCardModel[] = Array.from({ length: 48 }, (_, i) => ({
        id: i + 1,
        title: `Oferta #${i + 1}`,
        type: "Domek w górach",
        price_per_night: 120 + i * 5,
        rating: 4 + (i % 5) * 0.2,
        city: "Kraków",
        country: "Polska",
        img_url: "http://localhost:8000/media/images/zakopane1.png",
    }));

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
