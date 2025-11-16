// src/features/welcome-search/WelcomeAndSearchSection.tsx
import { Box } from '@mui/material';
import WelcomeContentText from './WelcomeContentText';
import WelcomeImageGrid from './WelcomeImageGrid';
import SearchCard from './SearchCard';

const WelcomeAndSearchSection = () => {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gridTemplateRows: { md: 'auto auto' },
            gap: { xs: 4, sm: 4, md: 5, lg: 6 },
            maxWidth: '1700px',
            mx: 'auto',
        }}>
            <Box sx={{
                gridColumn: { xs: '1', md: '1' },
                gridRow: { xs: '1', md: '1' },
                order: { xs: 1, md: 1 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <WelcomeContentText />
            </Box>

            <WelcomeImageGrid />
            <Box sx={{
                gridColumn: { xs: '1', md: '1' },
                gridRow: { xs: '3', md: '2' },
                order: { xs: 3, md: 3 },
                zIndex: 10,
                alignSelf: 'start',
            }}>
                <SearchCard />
            </Box>
        </Box>
    );
};

export default WelcomeAndSearchSection;