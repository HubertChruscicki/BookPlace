import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface HeaderCenterSectionProps {
    showSearch?: boolean;
    centerContent?: React.ReactNode;
}

const HeaderCenterSection: React.FC<HeaderCenterSectionProps> = ({showSearch = false, centerContent}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            mx: { xs: 1, sm: 2, md: 4 }
        }}>
            {centerContent || (showSearch && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                        fontStyle: 'italic'
                    }}
                >
                    {!isMobile && 'Search placeholder'}
                </Box>
            ))}
        </Box>
    );
};

export default HeaderCenterSection;