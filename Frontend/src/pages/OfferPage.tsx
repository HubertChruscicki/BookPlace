import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Divider, CircularProgress, Grid } from "@mui/material";
import { useOffer } from '../hooks/useOffers';
import OfferHeader from "../components/features/offer/OfferHeader";
import OfferPhotoGallery from '../components/features/offer/OfferPhotoGallery';
import OfferInfoSection from '../components/features/offer/OfferInfoSection';
import OfferAmenitiesSection from '../components/features/offer/OfferAmenitiesSection';
import OfferMapSection from '../components/features/offer/OfferMapSection';
import OfferBookingCard from '../components/features/offer/OfferBookingCard';
import OfferDescriptionSection from '../components/features/offer/OfferDescriptionSection';
import OfferReviewsSection from "../components/features/offer/OfferReviewsSection.tsx";

const OfferPage: React.FC = () => {
    const { offerId } = useParams<{ offerId: string }>();
    const selectedOfferId = offerId ?? '';

    const { data: offer, isLoading, isError } = useOffer(selectedOfferId);

    if (!selectedOfferId) {
        return <Typography color="error">Offer id is missing in the URL</Typography>;
    }

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (isError || !offer) return <Typography color="error">Offer not found</Typography>;

    return (
        <Container maxWidth="xl" sx={{ py: 4, pb: { xs: 1, md: 4 } }}>

            <OfferHeader offerTitle={offer.title} />
            <OfferPhotoGallery photos={offer.photos} />

            <Grid container spacing={8} sx={{ mt: 2 }}>

                <Grid size={{ xs: 12, md: 7, lg: 8 }} sx={{ pb: { xs: 2, md: 0 } }}>
                    
                    <OfferInfoSection offer={offer} />
                    <Divider />

                    <OfferDescriptionSection description={offer.description} />
                    <Divider />

                    <OfferAmenitiesSection amenities={offer.amenities} />
                    <Divider />

                    <OfferMapSection
                        lat={offer.addressLatitude}
                        lng={offer.addressLongitude}
                        address={offer.fullAddress}
                        city={offer.addressCity}
                        country={offer.addressCountry}
                    />
                    <Divider />
                    
                    <OfferReviewsSection offer={offer} />

                </Grid>

                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <Box sx={{ position: 'sticky', top: 100 }}>
                        <OfferBookingCard
                            pricePerNight={offer.pricePerNight}
                            maxGuests={offer.maxGuests}
                            offerId={offer.id}
                        />
                    </Box>
                </Grid>

            </Grid>
        </Container>
    );
};

export default OfferPage;