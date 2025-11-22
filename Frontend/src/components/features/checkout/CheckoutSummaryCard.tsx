import React from 'react';
import { Box, Button, Divider, Paper, Rating, Stack, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const AVERAGE_RATING = 4.5;

interface CheckoutSummaryCardProps {
    offer: any;
    nights: number;
    stayCost: number;
    serviceFee: number;
    totalCost: number;
    currency: Intl.NumberFormat;
    acceptTerms: boolean;
    isPending: boolean;
    handleBook: () => void;
    BASE_URL: string;
}

const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
                                                                     offer,
                                                                     nights,
                                                                     stayCost,
                                                                     serviceFee,
                                                                     totalCost,
                                                                     currency,
                                                                     acceptTerms,
                                                                     isPending,
                                                                     handleBook,
                                                                     BASE_URL
                                                                 }) => {

    const coverPhotoPath = offer?.photos?.find((photo: any) => photo.isCover)?.thumbnailUrl
        ?? offer?.photos?.[0]?.thumbnailUrl
        ?? offer?.photos?.[0]?.originalUrl;

    const photoUrl = coverPhotoPath ? `${BASE_URL}/${coverPhotoPath}` : '/logoSolo.png';

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Box
                    component="img"
                    src={photoUrl}
                    alt={offer.title}
                    sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                />
                <Box>
                    <Typography variant="h6" fontWeight={700}>{offer.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{offer.offerType?.name ?? 'Private stay'}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Rating
                            name="read-only"
                            value={AVERAGE_RATING}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{ color: '#faaf00' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {AVERAGE_RATING.toFixed(1)}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h3" color="text.primary">What price includes</Typography>
            <Stack spacing={1.5} sx={{ my: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">
                        {currency.format(offer.pricePerNight)} x {nights || 0} nights
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {currency.format(stayCost)}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">
                        BookPlace service fee
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {currency.format(serviceFee)}
                    </Typography>
                </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700}>{currency.format(totalCost)}</Typography>
            </Stack>
            <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!acceptTerms || nights <= 0 || isPending}
                onClick={handleBook}
                endIcon={!isPending && <ArrowForward />}
                sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    }
                }}
            >
                {isPending ? 'Processing...' : 'Book place'}
            </Button>
        </Paper>
    );
};

export default CheckoutSummaryCard;