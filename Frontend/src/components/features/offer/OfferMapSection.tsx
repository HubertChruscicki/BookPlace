import React from 'react';
import { Box, Typography } from "@mui/material";
import OfferMap from './OfferMap';

interface OfferMapSectionProps {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
}

const OfferMapSection: React.FC<OfferMapSectionProps> = ({ lat, lng, address, city, country }) => {
    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Where you'll be
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {city}, {country}
                </Typography>
            </Box>

            <Box sx={{ height: 480, borderRadius: 4, overflow: 'hidden' }}>
                <OfferMap
                    lat={lat}
                    lng={lng}
                    address={address}
                />
            </Box>
        </Box>
    );
};

export default OfferMapSection;