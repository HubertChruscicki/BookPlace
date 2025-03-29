import React, { useState } from 'react';
import {Avatar, Box, Button, Rating, Typography} from "@mui/material";

const OfferLocationRating: React.FC = () => {

  return (
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",
            width: '100%',
        }}>
              <Typography variant="h1" component="h2" sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
                    Offer type in Krakow, Poland
                </Typography>
            <Rating name="half-rating" defaultValue={4} precision={0.5} readOnly/>
        </Box>
  );
};

export default OfferLocationRating;
