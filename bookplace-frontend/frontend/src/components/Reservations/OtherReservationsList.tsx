import React from "react";
import { Box } from "@mui/material";
import ReservationList from "./ReservationList";
import ReservationFilters, { FilterType } from "./ReservationFilters";
import ReservationPagination from "./ReservationPagination";
import { useReservations } from "./useReservations";

const OtherReservationList: React.FC = () => {
    const {filter, setFilter, reservations, isLoading, page, setPage, maxPages} =
        useReservations({enableFilter: true, initialFilter: "archive", itemsPerPage: 3,
    });

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    mb: 2,
                    maxWidth: "1220px",
                }}
            >
                <ReservationFilters
                    activeFilter={filter}
                    onChangeFilter={(f: FilterType) => setFilter(f)}
                />

                <ReservationPagination
                    currentPage={page}
                    maxPages={maxPages}
                    onPrevPage={() => setPage(p => Math.max(p - 1, 0))}
                    onNextPage={() => setPage(p => Math.min(p + 1, maxPages - 1))}
                    disabled={isLoading || reservations.length === 0}
                />
            </Box>

            <ReservationList
                reservations={reservations}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default OtherReservationList;
