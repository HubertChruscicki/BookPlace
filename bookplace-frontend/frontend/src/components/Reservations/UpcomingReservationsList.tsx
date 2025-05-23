import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList.tsx";
import { Box } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import ReservationPagination from "./ReservationPagination.tsx";

const UpcomingReservationList: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationInfoModel[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<ReservationInfoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        const mockData = [
            {id:1,title:"Apartament w centrum",city:"Warszawa",country:"Polska",image:"https://images.unsplash.com/photo-1506744038136-46273834b3fb",start_date:"2024-07-01",end_date:"2024-07-05",status:"pending"},
            {id:2,title:"Domek nad jeziorem",city:"Giżycko",country:"Polska",image:"https://images.unsplash.com/photo-1464983953574-0892a716854b",start_date:"2024-08-10",end_date:"2024-08-15",status:"confirmed"},
            {id:3,title:"Studio w Krakowie",city:"Kraków",country:"Polska",image:"https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",start_date:"2024-09-01",end_date:"2024-09-03",status:"pending"},
            {id:4,title:"Apartament w Gdańsku",city:"Gdańsk",country:"Polska",image:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",start_date:"2024-10-12",end_date:"2024-10-18",status:"confirmed"},
            {id:5,title:"Willa w Zakopanem",city:"Zakopane",country:"Polska",image:"https://images.unsplash.com/photo-1465101046530-73398c7f28ca",start_date:"2024-11-20",end_date:"2024-11-25",status:"pending"},
            {id:6,title:"Loft w Poznaniu",city:"Poznań",country:"Polska",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",start_date:"2024-12-01",end_date:"2024-12-05",status:"confirmed"},
            {id:7,title:"Mieszkanie w Sopocie",city:"Sopot",country:"Polska",image:"https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",start_date:"2025-01-10",end_date:"2025-01-15",status:"pending"},
            {id:8,title:"Apartament w Łodzi",city:"Łódź",country:"Polska",image:"https://images.unsplash.com/photo-1501594907352-04cda38ebc29",start_date:"2025-02-20",end_date:"2025-02-25",status:"confirmed"},
            {id:9,title:"Domek w Bieszczadach",city:"Ustrzyki",country:"Polska",image:"https://images.unsplash.com/photo-1465101046530-73398c7f28ca",start_date:"2025-03-05",end_date:"2025-03-10",status:"pending"},
            {id:10,title:"Studio w Lublinie",city:"Lublin",country:"Polska",image:"https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",start_date:"2025-04-01",end_date:"2025-04-05",status:"confirmed"},
            {id:11,title:"Apartament w Katowicach",city:"Katowice",country:"Polska",image:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",start_date:"2025-05-10",end_date:"2025-05-15",status:"pending"},
            {id:12,title:"Willa w Szczecinie",city:"Szczecin",country:"Polska",image:"https://images.unsplash.com/photo-1465101046530-73398c7f28ca",start_date:"2025-06-20",end_date:"2025-06-25",status:"confirmed"},
            {id:13,title:"Loft w Toruniu",city:"Toruń",country:"Polska",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",start_date:"2025-07-01",end_date:"2025-07-05",status:"pending"},
            {id:14,title:"Mieszkanie w Olsztynie",city:"Olsztyn",country:"Polska",image:"https://images.unsplash.com/photo-1465101178521-c1a9136a3b99",start_date:"2025-08-10",end_date:"2025-08-15",status:"confirmed"},
            {id:15,title:"Apartament w Rzeszowie",city:"Rzeszów",country:"Polska",image:"https://images.unsplash.com/photo-1501594907352-04cda38ebc29",start_date:"2025-09-20",end_date:"2025-09-25",status:"pending"},
]
        setReservations(mockData);
        setIsLoading(false);
    }, []);

    //TODO MAYBE ZMIANA
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