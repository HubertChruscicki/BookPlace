import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {colors} from "../../theme/colors.ts";
import Divider from "@mui/material/Divider";

const OfferAmenitites: React.FC = () => {

  return (
      <Box>
            <Divider
            sx={{
                my: 3,
                borderColor: colors.grey[300],
            }}
            />

            <Typography sx={{fontSize: "1.5rem", fontWeight: "bold"}}>
            What you will find in this place
            </Typography>
            <Button
            variant="outlined"
            sx={{
                width: "250px",
                padding: "13px 23px",
                boxSizing: 'border-box',
                borderRadius: 2,
                border: `1px solid ${colors.black[900]}`,
                color: colors.black[900],
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem"
            }}
            >
            Show all amenities (20)
            </Button>
      </Box>

  );
};

export default OfferAmenitites;


