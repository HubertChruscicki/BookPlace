import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ReservationCard, { ReservationCardProps } from "./ReservationCard";
import {ReservationInfoModel} from "../../models/ReservationModel.ts";

interface ReservationListProps {
    reservations: ReservationInfoModel;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
    const [page, setPage] = useState(0);
    const itemsPerPage = 3;
    const maxPages = Math.ceil(reservations.length / itemsPerPage);

    const handlePrevPage = () => {
        setPage(prev => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setPage(prev => (prev < maxPages - 1 ? prev + 1 : prev));
    };

    return (
        <Box sx={{ width: "100%" }}>


            {reservations.length > 0 ? (
                <Box sx={{ display: "flex", }}>
                    {reservations
                        .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
                        .map(reservation => (
                            <ReservationCard key={reservation.id} reservation={reservation} />
                        ))}
                </Box>
            ) : (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Brak rezerwacji w tej kategorii
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ReservationList;