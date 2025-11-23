import React from 'react';
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import OfferMap from '../offer/OfferMap';

interface BookingDetailsMapProps {
    offerTitle: string;
    city: string;
    country: string | null;
}

const BookingDetailsMap: React.FC<BookingDetailsMapProps> = ({
    offerTitle,
    city,
    country,
}) => {
    const location = [city, country].filter(Boolean).join(', ');
    const defaultLat = 52.2297;
    const defaultLng = 21.0122;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
            }}
        >
            <Typography
                variant="h6"
                component="h3"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                }}
            >
                Location
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 3,
                }}
            >
                <LocationIcon 
                    sx={{ 
                        color: 'primary.main',
                        fontSize: 20,
                        mt: 0.2,
                    }} 
                />
                <Box>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                        }}
                    >
                        {offerTitle}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {location}
                    </Typography>
                </Box>
            </Box>

            <OfferMap 
                lat={defaultLat}
                lng={defaultLng}
                address={location}
                sx={{ 
                    height: 250,
                    borderRadius: 2,
                }}
            />
        </Paper>
    );
};

export default BookingDetailsMap;
