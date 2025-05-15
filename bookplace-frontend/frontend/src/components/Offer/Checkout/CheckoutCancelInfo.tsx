import {Box, styled, Typography} from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";


const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

interface CheckoutCancelInfoProps {
}

const CheckoutCancelInfo: React.FC<CheckoutCancelInfoProps> = ({}) => {
    return(
        <Box sx={{display: "flex", flexDirection: "column", width: "100%", gap: 3, my: 5, ml: 6}}>
            <Typography sx={{fontWeight: "700", fontSize: "1.8rem"}}>
                Cancel info
            </Typography>
            <Typography sx={{fontWeight: "500", fontSize: "1.1rem"}}>
                You will recieve a full refund if you cancel reservation for 7 days before checkin.
            </Typography>
            <Divider orientation="horizontal"
                     sx={{my: 1, borderTop: "0.005px solid lightgrey",}}
            />
        </Box>

    )
};


export default CheckoutCancelInfo;