import React from 'react';
import { Box, Typography, Rating } from "@mui/material";
import type {OfferDetail} from "../../../models/OfferModels";

interface OfferInfoSectionProps {
    offer: OfferDetail;
}

const OfferInfoSection: React.FC<OfferInfoSectionProps> = ({ offer }) => {

    const ratingValue = offer.rating ?? 4;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                    {offer.offerType?.name ?? 'Entire place'} in {offer.addressCity}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating
                        value={ratingValue}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ color: '#faaf00' }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {ratingValue.toFixed(1)}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="body1" color="text.secondary">
                {offer.maxGuests} guests · {offer.rooms} bedrooms · {offer.doubleBeds + offer.singleBeds} beds · {offer.bathrooms} baths
            </Typography>
        </Box>
    );
};

export default OfferInfoSection;