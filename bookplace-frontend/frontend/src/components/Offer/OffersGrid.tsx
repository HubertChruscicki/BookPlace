import React from "react";
import { Box } from "@mui/material";
import OfferCard from "./OfferCard";
import { OfferCardModel } from "../../models/OfferModel";

interface OffersGridProps {
    offers: OfferCardModel[];
}

const OffersGrid: React.FC<OffersGridProps> = ({ offers }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 4,
                py: 4
            }}
        >
            {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
            ))}
        </Box>
    );
};

export default OffersGrid;
