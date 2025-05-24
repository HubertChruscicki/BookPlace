import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList.tsx";
import { Box } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import ReservationPagination from "./ReservationPagination.tsx";
import ReservationFilters, {FilterType} from "./ReservationFilters.tsx";
import api from "../../api/axiosApi.ts";

const OtherReservationList: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationInfoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [activeFilter, setActiveFilter] = useState<FilterType>("archive");
    const itemsPerPage = 3;

    const getReservations = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/reservations/", {params: {status: activeFilter}});
            setReservations(res.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getReservations();
        setPage(0);
    }, [activeFilter]);

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

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
    };

    return (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 2,
                maxWidth: "1220px",
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <ReservationFilters
                        activeFilter={activeFilter}
                        onChangeFilter={handleFilterChange}
                    />
                    <ReservationPagination
                        currentPage={page}
                        maxPages={maxPages}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                        disabled={isLoading || reservations.length === 0}
                    />
                </Box>
            </Box>
            <ReservationList
                reservations={paginatedReservations}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default OtherReservationList;