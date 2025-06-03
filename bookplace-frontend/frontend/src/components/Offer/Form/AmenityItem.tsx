import React from 'react';
import { Box, Typography } from "@mui/material";
import { colors } from "../../../theme/colors.ts"

interface AmenityItemProps {
    name: string;
    icon: React.ReactNode;
}

const AmenityItem: React.FC<AmenityItemProps> = ({ name, icon }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            px: 1,
            borderRadius: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: colors.grey[100],
            },
        }}
    >
        <Box sx={{ color: colors.black[900], mr: 1.5 }}>
            {icon}
        </Box>
        <Typography sx={{ fontSize: "1rem" }}>
            {name}
        </Typography>
    </Box>
);

export default AmenityItem;
