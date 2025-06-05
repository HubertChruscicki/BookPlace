import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import {InfiniteData, useInfiniteQuery} from "@tanstack/react-query";
import api from "../../api/axiosApi.ts";
import { OfferCardModel } from "../../models/OfferModel.ts";
import { PaginatedResponse } from "../../models/ResponseModel.ts";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import FiltersButtonGroup from "../Common/FiltersButtonsGroup.tsx";
import { useInView } from "react-intersection-observer";
import OfferCard from "./OfferCard.tsx";

interface LandlordOffersContentProps {
    activeTab: string;
}

const LandlordOffersContent: React.FC<LandlordOffersContentProps> = ({ activeTab }) => {
    const navigate = useNavigate();
    const PAGE_SIZE = 12;

    const tabs = [
        { name: "All", link: "/landlord/offers/all" },
        { name: "Active", link: "/landlord/offers/active" },
        { name: "Inactive", link: "/landlord/offers/inactive" },
    ];

    const getActiveParam = (tabStatus: string) => {
        switch (tabStatus) {
            case 'active': return true;
            case 'inactive': return false;
            case 'all': return null;
            default: return null;
        }
    };

    const fetchOffers = async ({ pageParam = 0 }): Promise<PaginatedResponse<OfferCardModel>> => {
        const isActive = getActiveParam(activeTab);
        const params: { offset: number; limit: number; is_active?: boolean } = {
            offset: pageParam,
            limit: PAGE_SIZE,
        };

        if (isActive !== null) {
            params.is_active = isActive;
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
    } = useInfiniteQuery<
        PaginatedResponse<OfferCardModel>,
        Error,
        InfiniteData<PaginatedResponse<OfferCardModel>>,
        [string, string],
        number
    >({
        queryKey: ["landlordOffers", activeTab],
        queryFn: fetchOffers,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.next ? pages.length * PAGE_SIZE : undefined;
        },
        staleTime: 60 * 1000,
        initialPageParam: 0,
    });

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage]);

    const handleTabChange = (newTabLink: string) => {
        navigate(newTabLink);
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
                mb: 10,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem", ml: 1 }}>
                    Your Offers
                </Typography>
                <Button
                    component={Link}
                    to="/landlord/addOffer"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        textTransform: "none",
                        backgroundColor: colors.blue[500],
                        color:  "#fff",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        padding: "8px 16px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        borderWidth: 0,
                        "&:hover": {
                            backgroundColor: colors.blue[400],
                        },
                    }}
                >
                    Add new offer
                </Button>
            </Box>

            <FiltersButtonGroup
                options={tabs}
                selectedValue={`/landlord/offers/${activeTab}`}
                onChange={handleTabChange}
            />

            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    justifyContent: "center"
                }}
            >
                {allOffers.map((offer: OfferCardModel) => (
                    <OfferCard
                        key={offer.id}
                        offer={offer}
                        to={`/landlord/offers/${offer.id}`}
                    />
                ))}
            </Box>

            <Box
                ref={ref}
                sx={{
                    height: 50,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2
                }}
            >
                {(isLoading || isFetchingNextPage) && <CircularProgress />}
                {!hasNextPage && allOffers.length > 0 && (
                    <Typography color="text.secondary">
                        No offers to show
                    </Typography>
                )}
                {allOffers.length === 0 && !isLoading && (
                    <Typography variant="h6" color="text.secondary">
                        You have no offers yet.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default LandlordOffersContent;