import React, { useState } from "react";
import ReservationList from "./ReservationList.tsx";
import {Box, IconButton} from "@mui/material";
import {colors} from "../../theme/colors.ts";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {ReservationInfoModel} from "../../models/ReservationModel.ts";

const UpcomingReservationList: React.FC = () => {

    const reservations: ReservationInfoModel[] = [
            { id: 1, title: "Luksusowy apartament", city: "Warszawa", country: "Polska", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 2, title: "Domek nad jeziorem", city: "Mikołajki", country: "Polska", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 3, title: "Apartament z widokiem na morze", city: "Gdańsk", country: "Polska", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", start_date: "24.06.2025", end_date: "24.06.2025", status: "pending"},
            { id: 4, title: "Studio w centrum", city: "Kraków", country: "Polska", image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 5, title: "Dom wakacyjny", city: "Zakopane", country: "Polska", image: "https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee", start_date: "24.06.2025", end_date: "24.06.2025", status: "pending"},
            { id: 6, title: "Pokój dwuosobowy", city: "Wrocław", country: "Polska", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 7, title: "Luksusowy apartament", city: "Warszawa", country: "Polska", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 8, title: "Domek nad jeziorem", city: "Mikołajki", country: "Polska", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 9, title: "Apartament z widokiem na morze", city: "Gdańsk", country: "Polska", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 10, title: "Studio w centrum", city: "Kraków", country: "Polska", image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 11, title: "Dom wakacyjny", city: "Zakopane", country: "Polska", image: "https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee", start_date: "24.06.2025", end_date: "24.06.2025", status: "pending"},
            { id: 12, title: "Pokój dwuosobowy", city: "Wrocław", country: "Polska", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb", start_date: "24.06.2025", end_date: "24.06.2025", status: "pending"},
            { id: 13, title: "Luksusowy apartament", city: "Warszawa", country: "Polska", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 14, title: "Domek nad jeziorem", city: "Mikołajki", country: "Polska", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 15, title: "Apartament z widokiem na morze", city: "Gdańsk", country: "Polska", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed"},
            { id: 16, title: "Studio w centrum", city: "Kraków", country: "Polska", image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8", start_date: "24.06.2025", end_date: "24.06.2025", status: "confirmed" },
            { id: 17, title: "Studio w centrum", city: "Kraków", country: "Polska", image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8", start_date: "24.06.2025", end_date: "24.06.2025", status: "archive"},
            { id: 18, title: "Dom wakacyjny", city: "Zakopane", country: "Polska", image: "https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee", start_date: "24.06.2025", end_date: "24.06.2025", status: "archive"},
            { id: 19, title: "Pokój dwuosobowy", city: "Wrocław", country: "Polska", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb", start_date: "24.06.2025", end_date: "24.06.2025", status: "canceled"},
    ];

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
        <Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                maxWidth: "1220px",
            }}>
                <Box>
                    <IconButton
                        onClick={handlePrevPage}
                        disabled={page === 0 || reservations.length === 0}
                        sx={{ color: colors.blue[500] }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleNextPage}
                        disabled={page >= maxPages - 1 || reservations.length === 0}
                        sx={{ color: colors.blue[500] }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

            </Box>
            <ReservationList
                reservations={reservations}
            />
        </Box>

    );
};

export default UpcomingReservationList;