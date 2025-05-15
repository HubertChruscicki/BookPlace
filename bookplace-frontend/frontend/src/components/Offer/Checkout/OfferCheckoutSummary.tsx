import React, {useEffect, useState} from 'react';
import {Box, Rating, styled, Typography} from "@mui/material";
import Divider from '@mui/material/Divider';
import { Dayjs } from 'dayjs';
import {useOffer} from "../OfferContext.tsx";
import {colors} from "../../../theme/colors.ts"

const CheckoutSummaryCard = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignSelf: 'flex-start',
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 35,
    minHeight: "100px",
    height: "auto",
    minWidth: "450px",
    padding: "36px 24px",
    gap: 10,
    backgroundColor: `${colors.white[800]}`,
    marginTop: 30
})

const OfferInfoBox = styled(Box)({
    display: "flex",
    flexDirection: "row",
    alignItmes: "flex-start"
})

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

interface OfferCheckoutSummaryProps {
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
}

const OfferCheckoutSummary: React.FC<OfferCheckoutSummaryProps> = ({checkIn, checkOut}) => {

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



    const mainImage = offer?.images.find(img => img.is_main)?.image ?? null;
    console.log(mainImage);

    return (

        <CheckoutSummaryCard>
            <OfferInfoBox sx={{display: "flex", flexDirection: "row", alignItmes: "flex-start"}}>
                <Box
                    sx={{backgroundImage: mainImage ? `url(${mainImage})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: 5,
                        width: 120,
                        height: 120,
                        mr: 2
                    }}
                />
                <Box>
                    <Text weight="bold">
                        {offer?.title}
                    </Text>
                    <Text>
                        {offer?.offer_type?.name}
                    </Text>
                    <Rating name="half-rating" defaultValue={4} precision={0.5} readOnly/>
                </Box>
            </OfferInfoBox>

            <Divider
                orientation="horizontal"
                sx={{my: 1, borderTop: "0.005px solid lightgrey"}}
            />

            <Text weight="bold" sx={{my: 1}}>
                {"What price includes"}
            </Text>


            <Row justify="space-between">
                <Text>{`$${offer?.price_per_night} x ${amountOfDays} days`}</Text>
                <Text>{`$${price.toFixed(2)}`}</Text>
            </Row>

            <Row justify="space-between">
                <Text>BookPlace service fee</Text>
                <Text>{`$${fee.toFixed(2)}`}</Text>
            </Row>

            <Divider
                orientation="horizontal"
                sx={{my: 1, borderTop: "0.005px solid lightgrey"}}
            />

            <Row justify="space-between">
                <Text weight="bold">Total</Text>
                <Text weight="bold">{`$${totalPrice.toFixed(2)}`}</Text>
            </Row>
        </CheckoutSummaryCard>

    );
};

export default OfferCheckoutSummary;
