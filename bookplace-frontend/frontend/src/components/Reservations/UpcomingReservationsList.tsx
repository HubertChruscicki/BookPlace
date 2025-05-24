import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList.tsx";
import { Box } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import ReservationPagination from "./ReservationPagination.tsx";
import api from "../../api/axiosApi.ts";
import {useAuth} from "../../Auth/useAuth.ts";

const UpcomingReservationList: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationInfoModel[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<ReservationInfoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();
    const [page, setPage] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        if (!auth.token) return;
        setIsLoading(true);
        api.get("/reservations/")
            .then(res => setReservations(res.data.results))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [auth.token]);

    // //TODO MAYBE ZMIANA
    useEffect(() => {
        const filtered = reservations.filter(
            res => res.status === "pending" || res.status === "confirmed"
        );
        setFilteredReservations(filtered);
    }, [reservations]);

    const paginatedReservations = filteredReservations.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    const maxPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const handlePrevPage = () => {
        setPage(prev => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setPage(prev => (prev < maxPages - 1 ? prev + 1 : prev));
    };

    return (
        <Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                mb: 2,
                maxWidth: "1220px",
            }}>
                <ReservationPagination
                    currentPage={page}
                    maxPages={maxPages}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    disabled={isLoading || filteredReservations.length === 0}
                />
            </Box>
            <ReservationList
                reservations={paginatedReservations}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default UpcomingReservationList;