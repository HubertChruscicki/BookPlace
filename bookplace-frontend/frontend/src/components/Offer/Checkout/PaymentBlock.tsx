import {Box, styled, TextField, Typography} from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import FormStack from "../../Common/FormStack.tsx";


const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

interface CheckoutDetailsBlockProps {
}

const PaymentBlock: React.FC<CheckoutDetailsBlockProps> = ({}) => {
    return(
        <Box sx={{display: "flex", flexDirection: "column", width: "100%", gap: 3, my: 5, ml: 6}}>
            <Row justify={"space-between"}>
                <Typography sx={{fontWeight: "700", fontSize: "1.8rem"}}>
                    Payment Details
                </Typography>
                <Row sx={{width: "auto"}}>
                    <Box
                        component="img"
                        src="/visa_logo.svg"
                        alt="Visa Logo"
                        sx={{ width: 60, height: 60 }}
                    />
                    <Box
                        component="img"
                        src="/mastercard_logo.svg"
                        alt="MasterCard Logo"
                        sx={{ width: 60, height: 60 }}
                    />
                </Row>
            </Row>
            <FormStack spacing={2}>

                <TextField
                    label={"Cardholder"}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label={"Card number"}
                    variant="outlined"
                    fullWidth
                />
                <Row>
                    <TextField
                        label={"Expiry date"}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label={"CVV"}
                        variant="outlined"
                        fullWidth
                    />
                </Row>



            </FormStack>
            <Divider orientation="horizontal"
                     sx={{my: 1, borderTop: "0.005px solid lightgrey",}}
            />
        </Box>

    )
};


export default PaymentBlock;