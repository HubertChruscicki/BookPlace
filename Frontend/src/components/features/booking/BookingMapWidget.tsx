import React from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OfferMap from '../offer/OfferMap';
import type { BookingOffer } from '../../../models/BookingModels';

interface BookingMapWidgetProps {
    offer: BookingOffer;
}

const BookingMapWidget: React.FC<BookingMapWidgetProps> = ({ offer }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ height: 200, width: '100%', flexShrink: 0 }}>
                <OfferMap
                    lat={offer.addressLatitude}
                    lng={offer.addressLongitude}
                    address={offer.fullAddress}
                    sx={{ height: '100%', width: '100%' }}
                />
            </Box>

            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem' }}>
                    Address
                </Typography>

                <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon color="primary" fontSize="small" />
                        {offer.addressStreet}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2.5 }}>
                        {offer.addressCity}, {offer.addressZipCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2.5 }}>
                        {offer.addressCountry}
                    </Typography>
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                    }}
                    onClick={() => window.open(`http://maps.google.com/maps?q=${offer.addressLatitude},${offer.addressLongitude}`, '_blank')}
                >
                    Get directions
                </Button>
            </Box>
        </Paper>
    );
};

export default BookingMapWidget;