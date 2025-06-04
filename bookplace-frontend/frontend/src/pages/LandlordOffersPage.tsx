import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import {colors} from "../theme/colors.ts";
import LandlordOffersContent from "../components/Offer/LandlordOffersContent.tsx";
import {useNavigate, useParams} from "react-router-dom";


const LandlordOffersPage: React.FC = () => {

    type OfferStatus = "all" | "active" | "inactive" ;
    const OFFER_STATUS_VALUES: OfferStatus[] = ["all", "active", "inactive"];

    const navigate = useNavigate();
    const { status } = useParams<{ status?: string }>();

    const [activeTab, setActiveTab] = useState<OfferStatus>("all");
    useEffect(() => {
        if (status && OFFER_STATUS_VALUES.includes(status as OfferStatus)) {
            setActiveTab(status as OfferStatus);
        } else {
            navigate("/landlord/reservations/"); //TODO 404 EXCEPT NAVIGATION
        }
    }, [status]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: `${colors.white[800]}`,
                height: "100vh",
                p: "0px 40px",
            }}
        >
            <Header fullWidth landlordMode />
            <LandlordOffersContent activeTab={activeTab}/>
            <Footer />
        </Box>
    )

}

export default LandlordOffersPage;