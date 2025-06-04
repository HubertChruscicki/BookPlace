import React, {useEffect, useState} from 'react';
import { Box, Button, MenuItem, Select, styled, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {useOffer} from "./OfferContext.tsx";
import AvailableDatePicker from "./AvailableDatePicker.tsx";
import {colors} from "../../theme/colors.ts"

const SummaryCard = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-start",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 35,
    minHeight: "100px",
    height: "auto",
    padding: "36px 24px",
    gap: 10,
    backgroundColor: `${colors.white[800]}`,
    marginTop: 20,
    width: "100%",
    [theme.breakpoints.up("md")]: {
        maxWidth: "38%",
    },
    marginBottom: 50
}));

const Row = styled(Box)<{ justify?: string; align?: string }>(({ justify, align }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
    gap: 16,
}));

const Text = styled(Typography)<{ weight?: string }>(({ weight }) => ({
    fontWeight: weight ?? "400",
    fontSize: "1.3rem",
}));

interface OfferSummaryProps {
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
    guests: number | null;
    bookButtonActive: boolean;
    onChangeCheckIn: (d: Dayjs | null) => void;
    onChangeCheckOut: (d: Dayjs | null) => void;
    onSetGuestsNumber: (guestNumber: number) => void;
    onCheckout: () => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({checkIn, checkOut, guests, onChangeCheckOut, onChangeCheckIn, onSetGuestsNumber, onCheckout, bookButtonActive}) => {

    const { offer, isLoading, error } = useOffer();
    const [amountOfDays, setAmountOfDays] = useState(0);
    const [price, setPrice] = useState(0);
    const [fee, setFee] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateRangeError, setDateRangeError] = useState<string | null>(null);
    useEffect(() => {
        const newDaysAmmount= checkOut?.diff(checkIn, 'day') ?? 0;
        const newPrice = (offer?.price_per_night ?? 0) * (newDaysAmmount ?? 0);
        const newFee   = newPrice * 0.1;
        const newTotal = newPrice + newFee;
        setAmountOfDays(newDaysAmmount);
        setPrice(newPrice);
        setFee(newFee);
        setTotalPrice(newTotal);
    }, [checkIn, checkOut]);

    return (
    <SummaryCard>

         <Text weight="bold" sx={{my: 2}}>
             {`$${offer?.price_per_night} night`}
         </Text>

        <Box sx={{display: "flex", flexDirection: "row"}}>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
               <AvailableDatePicker
                    label={"Check in"}
                    offerID={offer?.id ?? 0}
                    value={checkIn}
                    onChange={onChangeCheckIn}
                    onSetDateRangeError={setDateRangeError}
               />
               <AvailableDatePicker
                    label={"Check out"}
                    offerID={offer?.id ?? 0}
                    value={checkOut}
                    onChange={onChangeCheckOut}
                    minDate={checkIn?.add(1, "day") ?? dayjs().add(1, "day").startOf('day')}
                    onSetDateRangeError={setDateRangeError}
               />
            </LocalizationProvider>
        </Box>
        <Select
            labelId="select-label"
            label="Geust number"
            value={guests ?? 1}
            onChange={(e)=>{
                const val = Number((e.target as HTMLInputElement).value);
                onSetGuestsNumber(val);
            }}>
            {Array.from({ length: (offer?.max_guests ?? 1) }, (_v, i) => i + 1).map(opt => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ))}
        </Select>

        <Button
            variant="contained"
            size="large"
            disabled={bookButtonActive && !dateRangeError}
            sx={{fontWeight: "bold", my: 1,
                borderRadius: 10,
                height: 50}}
            onClick={()=> {
                onCheckout()
            }}
        >
            Book now
        </Button>

        <Row justify="space-between">
            <Text>{`$${offer?.price_per_night} x ${amountOfDays} days`}</Text>
            <Text>{`$${price.toFixed(2)}`}</Text>
        </Row>

        <Row justify="space-between">
            <Text>BookPlace service fee</Text>
            <Text>{`$${fee.toFixed(2)}`}</Text>
        </Row>

        <Divider orientation="horizontal"
            sx={{
                my: 1,
                borderTop: "0.005px solid lightgrey",
            }}/>

        <Row justify="space-between">
            <Text weight="bold">Total</Text>
            <Text weight="bold">{`$${totalPrice.toFixed(2)}`}</Text>
        </Row>

    </SummaryCard>

  );
};

export default OfferSummary;
