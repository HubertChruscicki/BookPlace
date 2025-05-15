import {Box, styled, Typography} from "@mui/material";
import React from "react";


const Row = styled(Box)<{ justify?: string, align?: string }>(({ justify, align  }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

interface CheckoutOfferDetailProps {
    placeholder: string;
    detail: string;
    onButtonClick: () => void;
}

const CheckoutOfferDetail: React.FC<CheckoutOfferDetailProps> = ({placeholder, detail, onButtonClick}) => {
    return(
        <Box>
            <Row justify="space-between">
                <Typography  sx={{fontSize: "1.1rem", fontWeight: "600"}}>
                    {placeholder}
                </Typography>
                <Typography  sx={{fontSize: "1.1rem", fontWeight: "600", textDecoration: "underline", cursor: "pointer"}}>
                    Edit
                </Typography>
            </Row>
            <Typography  sx={{fontSize: "1.1rem"}} onClick={()=>onButtonClick()}>
                {detail}
            </Typography>
        </Box>

    )
};


export default CheckoutOfferDetail;