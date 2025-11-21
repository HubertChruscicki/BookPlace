import React from 'react';
import {Box, Typography, Button} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface OfferHeaderProps {
    offerTitle: string;
}

const OfferHeader: React.FC<OfferHeaderProps> = ({ offerTitle }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h1" sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                {offerTitle}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<ShareIcon />} sx={{ color: 'text.primary', textTransform: 'none', textDecoration: 'underline' }}>
                    Share
                </Button>
                <Button startIcon={<FavoriteBorderIcon />} sx={{ color: 'text.primary', textTransform: 'none', textDecoration: 'underline' }}>
                    Save
                </Button>
            </Box>
        </Box>

    );
};

export default OfferHeader;