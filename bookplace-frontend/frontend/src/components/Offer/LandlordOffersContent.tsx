import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import Divider from "@mui/material/Divider";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../api/axiosApi.ts";
import { OfferCardModel } from "../../models/OfferModel.ts";
import { PaginatedResponse } from "../../models/ResponseModel.ts";
import LandlordOffersTable from "./LandlordOffersTable.tsx";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

interface LandlordReservationsContentProps {
    activeTab: string;
}
const LandlordOffersContent: React.FC<LandlordReservationsContentProps> = ({activeTab}) => {
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
    const PAGE_SIZE = 12;

    const fetchOffers = async ({ pageParam = 0 }): Promise<PaginatedResponse<OfferCardModel>> => {
        const params: { offset: number; limit: number; is_active?: boolean } = {
            offset: pageParam,
            limit: PAGE_SIZE,
        };

        if (isActiveFilter !== null) {
            params.is_active = isActiveFilter;
        }

        const response = await api.get('/offers/landlord/', { params });
        return response.data;
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['landlordOffers', isActiveFilter],
        queryFn: fetchOffers,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.next) {
                return pages.length * PAGE_SIZE;
            }
            return undefined;
        },
        staleTime: 60 * 1000,
    });

    const handleFilterChange = (value: boolean | null) => {
        setIsActiveFilter(value);
    };

    const allOffers = data?.pages.flatMap(page => page.results) || [];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: `${colors.white[800]}`,
                width: "90%",
                height: "100%",
                marginTop: "30px",
                mb: 4,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem", ml: 1 }}>
                    Twoje oferty
                </Typography>
                <Button
                    component={Link}
                    to="/landlord/offers/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: colors.blue[600],
                        "&:hover": { backgroundColor: colors.blue[700] }
                    }}
                >
                    Add new offer
                </Button>
            </Box>

            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <Button
                    variant={isActiveFilter === null ? "contained" : "outlined"}
                    onClick={() => handleFilterChange(null)}
                    sx={{
                        textTransform: "none",
                        backgroundColor: isActiveFilter === null ? colors.blue[600] : "transparent",
                        "&:hover": { backgroundColor: isActiveFilter === null ? colors.blue[700] : undefined }
                    }}
                >
                    Wszystkie
                </Button>
                <Button
                    variant={isActiveFilter === true ? "contained" : "outlined"}
                    onClick={() => handleFilterChange(true)}
                    sx={{
                        textTransform: "none",
                        backgroundColor: isActiveFilter === true ? colors.blue[600] : "transparent",
                        "&:hover": { backgroundColor: isActiveFilter === true ? colors.blue[700] : undefined }
                    }}
                >
                    Aktywne
                </Button>
                <Button
                    variant={isActiveFilter === false ? "contained" : "outlined"}
                    onClick={() => handleFilterChange(false)}
                    sx={{
                        textTransform: "none",
                        backgroundColor: isActiveFilter === false ? colors.blue[600] : "transparent",
                        "&:hover": { backgroundColor: isActiveFilter === false ? colors.blue[700] : undefined }
                    }}
                >
                    Nieaktywne
                </Button>
            </Box>

            <Divider
                sx={{
                    ml: "-40px",
                    mr: "-40px",
                    mb: 3,
                }}
            />

            <LandlordOffersTable
                offers={allOffers}
                isLoading={isLoading || isFetchingNextPage}
                hasNextPage={!!hasNextPage}
                fetchNextPage={fetchNextPage}
            />
        </Box>
    );
};

export default LandlordOffersContent;