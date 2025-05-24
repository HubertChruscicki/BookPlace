import React from "react";
import { Box, Typography } from "@mui/material";
import ReservationCard from "./ReservationCard";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";

interface ReservationListProps {
    reservations: ReservationInfoModel[];
    isLoading?: boolean;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, isLoading }) => {
    return (
        <Box sx={{ width: "100%" }}>
            {isLoading ? (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Loading...
                    </Typography>
                </Box>
            ) : reservations.length > 0 ? (
                <Box sx={{ display: "flex" }}>
                    {reservations.map(reservation => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
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

export default ReservationList;