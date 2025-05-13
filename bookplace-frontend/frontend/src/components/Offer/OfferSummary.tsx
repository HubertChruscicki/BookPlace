import React, {useEffect, useState} from 'react';
import {Box, Button, MenuItem, Select, Typography} from "@mui/material";
import Divider from '@mui/material/Divider';
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {useOffer} from "./OfferContext.tsx";
import AvailableDatePicker from "./AvailableDatePicker.tsx";

interface OfferSummaryProps {
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
    onChangeCheckIn: (d: Dayjs | null) => void;
    onChangeCheckOut: (d: Dayjs | null) => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({checkIn, checkOut, onChangeCheckOut, onChangeCheckIn}) => {

    const { offer, isLoading, error } = useOffer();
    const [amountOfDays, setAmountOfDays] = useState(0);
    const [price, setPrice] = useState(0);
    const [fee, setFee] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

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
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "450px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: 5,
            minHeight: "300px",
            padding: "24px",
        }}
    >
        <Typography>
            {`$${offer?.price_per_night} night`}
        </Typography>

        <Box sx={{display: "flex", flexDirection: "row"}}>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
               <AvailableDatePicker
                    label={"Check in"}
                    offerID={offer?.id}
                    value={checkIn}
                    onChange={onChangeCheckIn}
               />
               <AvailableDatePicker
                    label={"Check out"}
                    offerID={offer?.id}
                    value={checkOut}
                    onChange={onChangeCheckOut}
                    minDate={checkIn?.add(1, "day") ?? dayjs().add(1, "day").startOf('day')}
               />
            </LocalizationProvider>
        </Box>
        <Select
            labelId="select-label"a
            label="Geust number"
        >
            {Array.from({ length: (offer?.max_guests ?? 1) }, (_v, i) => i + 1).map(opt => (
                <MenuItem key={opt} value={opt}>
                    {opt}
                </MenuItem>
            ))}
        </Select>

        <Button
            variant="contained"
            size="large"
            sx={{fontWeight: "bold"}}
        >
            Book now
        </Button>

        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography>
                {`$${offer?.price_per_night} x ${amountOfDays} days`}
            </Typography>
            <Typography>
                {`$${price}`}
            </Typography>
        </Box>

        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography>
                {"BookPlace service fee"}
            </Typography>
            <Typography>
                {`$${fee}`}
            </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{display: "flex", justifyContent: "space-between", fontWeight: "bold"}}>
            <Typography sx={{fontWeight: "bold"}}>
                Total
            </Typography>
            <Typography sx={{fontWeight: "bold"}}>
                {`$${totalPrice}`}
            </Typography>
        </Box>

    </Box>

  );
};

export default OfferSummary;
