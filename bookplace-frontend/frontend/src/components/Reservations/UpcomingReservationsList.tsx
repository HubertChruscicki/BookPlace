import React from "react";
import { Box } from "@mui/material";
import ReservationList from "./ReservationList";
import ReservationPagination from "./ReservationPagination";
import { useReservations } from "./useReservations";

const UpcomingReservationList: React.FC = () => {const {reservations, isLoading, page, setPage, maxPages} =
    useReservations({enableFilter: false, itemsPerPage: 3,
    });

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    maxWidth: "1220px",
                }}
            >
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

export default UpcomingReservationList;
