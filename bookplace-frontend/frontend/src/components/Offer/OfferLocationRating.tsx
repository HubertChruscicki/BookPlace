import React from 'react';
import {Box, Rating, Typography} from "@mui/material";
import {useOffer} from "./OfferContext.tsx";

const OfferLocationRating: React.FC = () => {

    const { offer, isLoading, error } = useOffer();

    return (
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",
            width: '100%',
        }}>
              <Typography variant="h1" component="h2" sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                  {`${offer?.offer_type.name} in ${offer?.location.city}, ${offer?.location.country}`}
                </Typography>
            <Rating name="half-rating" defaultValue={4} precision={0.5} readOnly/>
        </Box>
    );
};

export default OfferLocationRating;
