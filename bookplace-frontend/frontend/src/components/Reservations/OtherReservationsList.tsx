import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList.tsx";
import { Box } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import ReservationPagination from "./ReservationPagination.tsx";
import ReservationFilters, {FilterType} from "./ReservationFilters.tsx";

const OtherReservationList: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationInfoModel[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<ReservationInfoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [activeFilter, setActiveFilter] = useState<FilterType>("archive");
    const itemsPerPage = 3;

    useEffect(() => {
        const mockData = [
            { id: 1, title: "Rezerwacja 1", city: "Warszawa", country: "Polska", image: "https://picsum.photos/seed/1/200/120", start_date: "2024-07-01", end_date: "2024-07-03", status: "archive" },
            { id: 2, title: "Rezerwacja 2", city: "Kraków", country: "Polska", image: "https://picsum.photos/seed/2/200/120", start_date: "2024-07-02", end_date: "2024-07-04", status: "canceled" },
            { id: 3, title: "Rezerwacja 3", city: "Gdańsk", country: "Polska", image: "https://picsum.photos/seed/3/200/120", start_date: "2024-07-03", end_date: "2024-07-05", status: "archive" },
            { id: 4, title: "Rezerwacja 4", city: "Wrocław", country: "Polska", image: "https://picsum.photos/seed/4/200/120", start_date: "2024-07-04", end_date: "2024-07-06", status: "canceled" },
            { id: 5, title: "Rezerwacja 5", city: "Poznań", country: "Polska", image: "https://picsum.photos/seed/5/200/120", start_date: "2024-07-05", end_date: "2024-07-07", status: "archive" },
            { id: 6, title: "Rezerwacja 6", city: "Warszawa", country: "Polska", image: "https://picsum.photos/seed/6/200/120", start_date: "2024-07-06", end_date: "2024-07-08", status: "canceled" },
            { id: 7, title: "Rezerwacja 7", city: "Kraków", country: "Polska", image: "https://picsum.photos/seed/7/200/120", start_date: "2024-07-07", end_date: "2024-07-09", status: "archive" },
            { id: 8, title: "Rezerwacja 8", city: "Gdańsk", country: "Polska", image: "https://picsum.photos/seed/8/200/120", start_date: "2024-07-08", end_date: "2024-07-10", status: "canceled" },
            { id: 9, title: "Rezerwacja 9", city: "Wrocław", country: "Polska", image: "https://picsum.photos/seed/9/200/120", start_date: "2024-07-09", end_date: "2024-07-11", status: "archive" },
            { id: 10, title: "Rezerwacja 10", city: "Poznań", country: "Polska", image: "https://picsum.photos/seed/10/200/120", start_date: "2024-07-10", end_date: "2024-07-12", status: "canceled" },
            { id: 11, title: "Rezerwacja 11", city: "Warszawa", country: "Polska", image: "https://picsum.photos/seed/11/200/120", start_date: "2024-07-11", end_date: "2024-07-13", status: "archive" },
            { id: 12, title: "Rezerwacja 12", city: "Kraków", country: "Polska", image: "https://picsum.photos/seed/12/200/120", start_date: "2024-07-12", end_date: "2024-07-14", status: "canceled" },
            { id: 13, title: "Rezerwacja 13", city: "Gdańsk", country: "Polska", image: "https://picsum.photos/seed/13/200/120", start_date: "2024-07-13", end_date: "2024-07-15", status: "archive" },
            { id: 14, title: "Rezerwacja 14", city: "Wrocław", country: "Polska", image: "https://picsum.photos/seed/14/200/120", start_date: "2024-07-14", end_date: "2024-07-16", status: "canceled" },
            { id: 15, title: "Rezerwacja 15", city: "Poznań", country: "Polska", image: "https://picsum.photos/seed/15/200/120", start_date: "2024-07-15", end_date: "2024-07-17", status: "archive" },
            { id: 16, title: "Rezerwacja 16", city: "Warszawa", country: "Polska", image: "https://picsum.photos/seed/16/200/120", start_date: "2024-07-16", end_date: "2024-07-18", status: "canceled" },
            { id: 17, title: "Rezerwacja 17", city: "Kraków", country: "Polska", image: "https://picsum.photos/seed/17/200/120", start_date: "2024-07-17", end_date: "2024-07-19", status: "archive" },
            { id: 18, title: "Rezerwacja 18", city: "Gdańsk", country: "Polska", image: "https://picsum.photos/seed/18/200/120", start_date: "2024-07-18", end_date: "2024-07-20", status: "canceled" },
            { id: 19, title: "Rezerwacja 19", city: "Wrocław", country: "Polska", image: "https://picsum.photos/seed/19/200/120", start_date: "2024-07-19", end_date: "2024-07-21", status: "archive" },
            { id: 20, title: "Rezerwacja 20", city: "Poznań", country: "Polska", image: "https://picsum.photos/seed/20/200/120", start_date: "2024-07-20", end_date: "2024-07-22", status: "canceled" },
            { id: 21, title: "Rezerwacja 21", city: "Warszawa", country: "Polska", image: "https://picsum.photos/seed/21/200/120", start_date: "2024-07-21", end_date: "2024-07-23", status: "archive" },
            { id: 22, title: "Rezerwacja 22", city: "Kraków", country: "Polska", image: "https://picsum.photos/seed/22/200/120", start_date: "2024-07-22", end_date: "2024-07-24", status: "canceled" },
            { id: 23, title: "Rezerwacja 23", city: "Gdańsk", country: "Polska", image: "https://picsum.photos/seed/23/200/120", start_date: "2024-07-23", end_date: "2024-07-25", status: "archive" },
            { id: 24, title: "Rezerwacja 24", city: "Wrocław", country: "Polska", image: "https://picsum.photos/seed/24/200/120", start_date: "2024-07-24", end_date: "2024-07-26", status: "canceled" },
            { id: 25, title: "Rezerwacja 25", city: "Poznań", country: "Polska", image: "https://picsum.photos/seed/25/200/120", start_date: "2024-07-25", end_date: "2024-07-27", status: "archive" },
        ];

        setReservations(mockData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const filtered = reservations.filter(res => res.status === activeFilter);
        setFilteredReservations(filtered);
        setPage(0);
    }, [reservations, activeFilter]);

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
                        disabled={isLoading || filteredReservations.length === 0}
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