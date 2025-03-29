import React from 'react';
import {Box, Button, Select, Typography} from "@mui/material";
import Divider from '@mui/material/Divider';
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const OfferSummary: React.FC = () => {


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
            160zl noc
        </Typography>

        <Box sx={{display: "flex", flexDirection: "row"}}>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Check in" />
                <DatePicker label="Check out" />
            </LocalizationProvider>
        </Box>
        <Select>
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
                350zl x 5 day
            </Typography>
            <Typography>
                1750zl
            </Typography>
        </Box>

        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography>
                350zl x 5 day
            </Typography>
            <Typography>
                1750zl
            </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{display: "flex", justifyContent: "space-between", fontWeight: "bold"}}>
            <Typography sx={{fontWeight: "bold"}}>
                Total
            </Typography>
            <Typography sx={{fontWeight: "bold"}}>
                1750zl
            </Typography>
        </Box>



    </Box>

  );
};

export default OfferSummary;
