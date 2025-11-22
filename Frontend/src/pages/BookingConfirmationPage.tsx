import React from 'react';
import {Box, Button, Container, Paper, Stack, Typography, CircularProgress} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useOffer} from '../hooks/useOffers';

const BookingConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const offerIdParam = searchParams.get('offerId');
    const {data: offer, isLoading} = useOffer(offerIdParam ?? '');

    const checkInDate = searchParams.get('CheckInDate');
    const checkOutDate = searchParams.get('CheckOutDate');
    const guests = searchParams.get('Guests');

    const offerTitle = offer?.title ?? 'Selected offer';

    if (isLoading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 10}}><CircularProgress/></Box>;
    }

    return (
        <Container maxWidth="sm" sx={{py: 6}}>
            <Paper elevation={4} sx={{p: {xs: 3, sm: 5}, borderRadius: 3, textAlign: 'center'}}>
                <CheckCircleOutlineIcon sx={{color: 'success.main', fontSize: 80, mb: 3}}/>

                <Typography variant="h3" fontWeight={700} sx={{mb: 1, color: 'success.main'}}>
                    Request Sent!
                </Typography>

                <Typography variant="h6" sx={{mb: 3}}>
                    Your reservation request for {offerTitle} has been successfully submitted.
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                    The host has 24 hours to confirm your booking. You will receive an email notification once the
                    status is updated.
                </Typography>

                <Stack spacing={1} sx={{mb: 4, textAlign: 'left', bgcolor: 'grey.100', p: 2, borderRadius: 2}}>
                    <Typography variant="body1"  >
                        <Box component="strong" sx={{fontWeight: 600}}>Dates:</Box> {checkInDate} - {checkOutDate}
                    </Typography>
                    <Typography variant="body1">
                        <Box component="strong" sx={{fontWeight: 600}}>Guests:</Box> {guests}
                    </Typography>
                    <Typography variant="body1">
                        <Box component="strong" sx={{fontWeight: 600}}>Offer ID:</Box> {offerIdParam}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/')}
                        sx={{borderRadius: 3, textTransform: 'none'}}
                    >
                        Back to Home
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/your-bookings')}
                        sx={{borderRadius: 3, textTransform: 'none'}}
                    >
                        View Bookings
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default BookingConfirmationPage;