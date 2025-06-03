import React from "react";
import {Box, Typography} from "@mui/material";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";
import ReservationsPageContent from "../components/Reservations/ReservationsPageContent.tsx";
import {colors} from "../theme/colors.ts";

const LandlordOffersPage: React.FC = () => {
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
            <Typography>
                calendar
            </Typography>
            <Footer />
        </Box>
    )

}

export default LandlordOffersPage;