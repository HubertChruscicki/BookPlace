import React, { useEffect, useMemo } from 'react';
import { Box, Button, Typography, Divider, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface OfferBookingCardProps {
    pricePerNight: number;
    maxGuests: number;
    offerId: number;
}

const OfferBookingCard: React.FC<OfferBookingCardProps> = ({ pricePerNight, maxGuests }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    const checkInParam = searchParams.get('CheckInDate');
    const checkOutParam = searchParams.get('CheckOutDate');
    const guestsParam = searchParams.get('Guests');

    const [checkIn, setCheckIn] = React.useState<Dayjs | null>(checkInParam ? dayjs(checkInParam) : null);
    const [checkOut, setCheckOut] = React.useState<Dayjs | null>(checkOutParam ? dayjs(checkOutParam) : null);
    const [guests, setGuests] = React.useState<number>(guestsParam ? parseInt(guestsParam) : 1);

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        if (checkIn) newParams.set('CheckInDate', checkIn.format('YYYY-MM-DD'));
        if (checkOut) newParams.set('CheckOutDate', checkOut.format('YYYY-MM-DD'));
        newParams.set('Guests', guests.toString());
        setSearchParams(newParams, { replace: true });
    }, [checkIn, checkOut, guests]);

    const nights = useMemo(() => {
        if (checkIn && checkOut) return checkOut.diff(checkIn, 'day');
        return 0;
    }, [checkIn, checkOut]);

    const totalPrice = nights > 0 ? pricePerNight * nights : 0;
    const serviceFee = totalPrice * 0.12;
    const total = totalPrice + serviceFee;

    return (
        <Paper
            elevation={isMdUp ? 3 : 8}
            sx={{
                p: isMdUp ? 3 : 2,
                borderRadius: isMdUp ? 6 : 0,
                border: isMdUp ? '1px solid' : 'none',
                borderColor: 'divider',
                position: isMdUp ? 'sticky' : 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                top: isMdUp ? 100 : 'auto',
                zIndex: isMdUp ? 'auto' : 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: isMdUp ? 'auto' : 'auto',
                justifyContent: isMdUp ? 'flex-start' : 'center',
                flexWrap: 'nowrap',
            }}
        >
            {!isMdUp && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    my: 'auto',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant="h5" fontWeight="bold">${pricePerNight}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>night</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontSize: '0.95rem',
                            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                            },
                            minWidth: '120px'
                        }}
                    >
                        Reserve
                    </Button>
                </Box>
            )}

            {isMdUp && (
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography variant="h2">${pricePerNight}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>night</Typography>
                </Box>
            )}

            {isMdUp && (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <DatePicker
                                label="Check-in"
                                value={checkIn}
                                onChange={(newValue) => setCheckIn(newValue)}
                                slotProps={{ textField: { size: 'small', sx: { borderRadius: 4 } } }}
                            />
                            <DatePicker
                                label="Check-out"
                                value={checkOut}
                                onChange={(newValue) => setCheckOut(newValue)}
                                minDate={checkIn ? checkIn.add(1, 'day') : dayjs()}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </Box>
                    </LocalizationProvider>

                    <FormControl fullWidth size="small">
                        <InputLabel>Guests</InputLabel>
                        <Select
                            value={guests}
                            label="Guests"
                            onChange={(e) => setGuests(Number(e.target.value))}
                        >
                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                                <MenuItem key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}

            {isMdUp && (
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        borderRadius: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                        }
                    }}
                >
                    Reserve
                </Button>
            )}

            {isMdUp && nights > 0 && (
                <>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">
                                ${pricePerNight} x {nights} nights
                            </Typography>
                            <Typography>${totalPrice.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">
                                Service fee
                            </Typography>
                            <Typography>${serviceFee.toFixed(2)}</Typography>
                        </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="h4">Total</Typography>
                        <Typography variant="h4">${total.toFixed(2)}</Typography>
                    </Box>
                </>
            )}

        </Paper>
    );
};

export default OfferBookingCard;