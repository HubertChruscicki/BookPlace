import React from 'react';
import { Box, Typography, Avatar } from "@mui/material";
import type {OfferDetail} from "../../../models/OfferModels";

interface OfferHostInfoProps {
    host: OfferDetail['host'];
}

const OfferHostInfo: React.FC<OfferHostInfoProps> = ({ host }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
            <Avatar 
                src={host?.avatarUrl} 
                alt={host?.name}
                sx={{ width: 56, height: 56 }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Hosted by {host?.name ?? 'Owner'}
            </Typography>
        </Box>
    );
};

export default OfferHostInfo;