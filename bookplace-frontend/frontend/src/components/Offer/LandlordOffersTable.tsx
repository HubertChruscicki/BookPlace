import React from "react";
import { Box, Typography, CircularProgress, Paper, Divider } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import { OfferCardModel } from "../../models/OfferModel.ts";
import { useInView } from "react-intersection-observer";
import PlaceIcon from "@mui/icons-material/Place";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

interface LandlordOffersTableProps {
    offers: OfferCardModel[];
    isLoading: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
}

const LandlordOffersTable: React.FC<LandlordOffersTableProps> = ({
                                                                     offers,
                                                                     isLoading,
                                                                     hasNextPage,
                                                                     fetchNextPage,
                                                                 }) => {
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    React.useEffect(() => {
        if (inView && hasNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isLoading, fetchNextPage]);

    if (!offers.length && !isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6">Nie masz jeszcze żadnych ofert</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3, width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
                {offers.map((offer) => (
                    <Paper
                        key={offer.id}
                        component={Link}
                        to={`/landlord/offers/${offer.id}`}
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden",
                            textDecoration: "none",
                            color: "inherit",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 3,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                height: 200,
                                backgroundImage: `url(${offer.img_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 1,
                                mb: 2,
                            }}
                        />
                        <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
                            {offer.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {offer.type}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PlaceIcon sx={{ fontSize: 16, mr: 0.5, color: colors.blue[600] }} />
                                <Typography variant="body2">
                                    {offer.city}, {offer.country}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <StarIcon sx={{ fontSize: 16, mr: 0.5, color: colors.yellow[500] }} />
                                <Typography variant="body2">{offer.rating}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, color: colors.green[500] }} />
                            <Typography variant="body2" fontWeight="bold">
                                {offer.price_per_night} zł / noc
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Element do wykrywania przewijania */}
            <Box ref={ref} sx={{ height: 20, mt: 2 }} />

            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress size={30} />
                </Box>
            )}
        </Box>
    );
};

export default LandlordOffersTable;