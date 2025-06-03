import React from "react";
import { Box, Typography } from "@mui/material";
import ReservationCard from "./ReservationCard";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import LandlordReservationCard from "./LandlordReservationCard.tsx";

interface LandlordReservationListProps {
    reservations: ReservationInfoModel[];
    isLoading?: boolean;
}

const LandlordReservationList: React.FC<LandlordReservationListProps> = ({ reservations, isLoading }) => {
    return (
        <Box sx={{ width: "100%" }}>
            {isLoading ? (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Loading...
                    </Typography>
                </Box>
            ) : reservations.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {reservations.map(reservation => (
                        <LandlordReservationCard key={reservation.id} reservation={reservation} />
                    ))}
                </Box>
            ) : (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Nothing found
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default LandlordReservationList;