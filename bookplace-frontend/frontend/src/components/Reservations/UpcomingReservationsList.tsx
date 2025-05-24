import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList.tsx";
import { Box } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import ReservationPagination from "./ReservationPagination.tsx";
import api from "../../api/axiosApi.ts";

const UpcomingReservationList: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationInfoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const itemsPerPage = 3;

    const getReservations = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/reservations/");
            setReservations(res?.data?.results?.filter((r: ReservationInfoModel) => r.status === "pending" || r.status === "confirmed"));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getReservations();
    }, []);

    const paginatedReservations = reservations.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    const maxPages = Math.ceil(reservations.length / itemsPerPage);

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
                    disabled={isLoading || reservations.length === 0}
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