import React, { useState } from 'react';
import {Avatar, Box, Typography} from "@mui/material";
const OfferLandlordPreview: React.FC = () => {

  return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", mt: 4}}>
        <Avatar
            alt="Remy Sharp"
            sx={{ width: 42, height: 42, mr: 2 }}
        >
        </Avatar>
        <Typography variant="h1" component="h2" sx={{fontSize: "1.2rem", fontWeight: "bold"}}>
            Landlord is Hubert
        </Typography>
    </Box>
  );
};

export default OfferLandlordPreview;
