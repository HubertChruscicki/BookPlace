import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { useOffer } from '../hooks/useOffers';
import { useCreateBooking } from '../hooks/useBooking';
import TripDetailsSection from '../components/features/checkout/TripDetailsSection';
import PaymentMethodSection from '../components/features/checkout/PaymentMethodSection';
import CheckoutSummaryCard from '../components/features/checkout/CheckoutSummaryCard';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SERVICE_FEE_RATE = 0.12;
const URL_DATE_FORMAT = 'YYYY-MM-DD'; 

const BookingCheckoutPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const offerIdParam = searchParams.get('offerId');
    const checkInParam = searchParams.get('CheckInDate');
    const checkOutParam = searchParams.get('CheckOutDate');
    const guestsParam = searchParams.get('Guests');

    const [checkIn, setCheckIn] = useState<Dayjs | null>(checkInParam && checkInParam !== 'Invalid Date' ? dayjs(checkInParam, URL_DATE_FORMAT) : null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(checkOutParam && checkOutParam !== 'Invalid Date' ? dayjs(checkOutParam, URL_DATE_FORMAT) : null);

    const [guests, setGuests] = useState<number>(guestsParam ? Number(guestsParam) : 1);
    const [paymentMethod, setPaymentMethod] = useState<string>('blik');
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const offerIdNumber = offerIdParam ? Number(offerIdParam) : undefined;
    const { data: offer, isLoading, isError } = useOffer(offerIdParam ?? '');
    const { mutate: createBooking, isPending } = useCreateBooking();

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (checkIn && checkIn.isValid()) {
            params.set('CheckInDate', checkIn.format(URL_DATE_FORMAT));
        } else if (checkInParam) {
            params.set('CheckInDate', 'Invalid Date');
        }

        if (checkOut && checkOut.isValid()) {
            params.set('CheckOutDate', checkOut.format(URL_DATE_FORMAT));
        } else if (checkOutParam) {
            params.set('CheckOutDate', 'Invalid Date');
        }

        params.set('Guests', guests.toString());
        if (offerIdParam) {
            params.set('offerId', offerIdParam);
        }
        setSearchParams(params, { replace: true });
    }, [checkIn, checkOut, guests]);

    const nights = useMemo(() => {
        if (checkIn && checkOut && checkIn.isValid() && checkOut.isValid()) {
            return checkOut.diff(checkIn, 'day');
        }
        return 0;
    }, [checkIn, checkOut]);

    const nightPrice = offer?.pricePerNight ?? 0;
    const stayCost = nights > 0 ? nightPrice * nights : 0;
    const serviceFee = stayCost * SERVICE_FEE_RATE;
    const totalCost = stayCost + serviceFee;

    const currency = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }), []);

    const handleBook = () => {
        setFeedback(null);
        if (!offerIdNumber || !checkIn || !checkOut || nights <= 0) {
            setFeedback({ type: 'error', text: 'Please provide valid stay details before booking.' });
            return;
        }

        const confirmationParams = {
            offerId: offerIdNumber.toString(),
            CheckInDate: checkIn.format(URL_DATE_FORMAT),
            CheckOutDate: checkOut.format(URL_DATE_FORMAT),
            Guests: guests.toString(),
        };

        createBooking({
            offerId: offerIdNumber,
            checkInDate: checkIn.format(URL_DATE_FORMAT),
            checkOutDate: checkOut.format(URL_DATE_FORMAT),
            numberOfGuests: guests,
        }, {
            onSuccess: () => {
                navigate({
                    pathname: '/booking/confirmation',
                    search: createSearchParams(confirmationParams).toString(),
                }, { replace: true });
            },
            onError: () => {
                setFeedback({ type: 'error', text: 'We could not finalize the booking. Please try again.' });
            }
        });
    };

    const missingInitialData = !offerIdParam || !checkInParam || !checkOutParam;

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
    if (isError || !offer) return <Alert severity="error">We were unable to load the offer details.</Alert>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <IconButton aria-label="Go back" onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" fontWeight={700}>
                        Ask for reservation
                    </Typography>
                </Stack>

                {missingInitialData && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Missing stay details. Please go back to the offer and select your dates again.
                    </Alert>
                )}

                {feedback && (
                    <Alert severity={feedback.type} sx={{ mb: 3 }}>
                        {feedback.text}
                    </Alert>
                )}

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7 }} sx={{ pb: { xs: 2, md: 0 } }}>

                        <TripDetailsSection
                            checkIn={checkIn}
                            checkOut={checkOut}
                            guests={guests}
                            maxGuests={offer.maxGuests}
                            nights={nights}
                            setCheckIn={setCheckIn}
                            setCheckOut={setCheckOut}
                            setGuests={setGuests}
                        />

                        <PaymentMethodSection
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />

                        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>Cancellation policy</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Free cancellation within 48 hours of booking. After that, receive a 50% refund up until 7 days before check-in. By continuing you agree to the house rules and BookPlace terms of service.
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={acceptTerms}
                                        onChange={(event) => setAcceptTerms(event.target.checked)}
                                    />
                                }
                                label="I accept the property rules and BookPlace terms."
                            />
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <CheckoutSummaryCard
                            offer={offer}
                            nights={nights}
                            stayCost={stayCost}
                            serviceFee={serviceFee}
                            totalCost={totalCost}
                            currency={currency}
                            acceptTerms={acceptTerms}
                            isPending={isPending}
                            handleBook={handleBook}
                            BASE_URL={BASE_URL}
                        />
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default BookingCheckoutPage;