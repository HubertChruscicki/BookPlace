import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import {colors} from "../theme/colors.ts";
import LandlordReservationsContent from "../components/Reservations/LandlordReservationsContent.tsx";
import {useNavigate, useParams} from "react-router-dom";

const LandlordOffersPage: React.FC = () => {

    type ReservationStatus = "upcoming" | "archive" | "canceled" | "all";
    const RESERVATION_STATUS_VALUES: ReservationStatus[] = ["upcoming", "archive", "canceled", "all"];

    const navigate = useNavigate();
    const { status } = useParams<{ status?: string }>();

    const [activeTab, setActiveTab] = useState<ReservationStatus>("upcoming");
    useEffect(() => {
        if (status && RESERVATION_STATUS_VALUES.includes(status as ReservationStatus)) {
            setActiveTab(status as ReservationStatus);
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
            <LandlordReservationsContent activeTab={activeTab}/>
            <Footer />
        </Box>
    )

}

export default LandlordOffersPage;