import React from 'react';
import {Box, Typography, Rating, Avatar} from "@mui/material";
import type {OfferDetail} from "../../../models/OfferModels";

interface OfferInfoSectionProps {
    offer: OfferDetail;
}

const OfferInfoSection: React.FC<OfferInfoSectionProps> = ({ offer }) => {

    const ratingValue = offer.rating ?? 4;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" component="h2" sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Avatar
                    src={offer.host?.avatarUrl}
                    alt={offer.host?.name}
                    sx={{ width: 48, height: 48 }}
                />
                <Typography variant="h6" sx={{ fontSize: "1rem" ,fontWeight: 'bold', mb: 0.5 }}>
                    Hosted by {offer.host?.name ?? 'Owner'}
                </Typography>
            </Box>
        </Box>
    );
};

export default OfferInfoSection;