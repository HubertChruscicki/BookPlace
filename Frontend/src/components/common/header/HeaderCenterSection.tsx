import React from 'react';
import { Box } from '@mui/material';
import HeaderSearch from './HeaderSearch';

interface HeaderCenterSectionProps {
    showSearch?: boolean;
    centerContent?: React.ReactNode;
}

const HeaderCenterSection: React.FC<HeaderCenterSectionProps> = ({showSearch = false, centerContent}) => {
    return (
        <Box sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            mx: { xs: 1, sm: 2, md: 4 }
        }}>
            {centerContent || (showSearch && <HeaderSearch />)}
        </Box>
    );
};

export default HeaderCenterSection;