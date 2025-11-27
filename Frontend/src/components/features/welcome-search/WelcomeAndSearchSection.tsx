import { Box } from '@mui/material';
import WelcomeContentText from './WelcomeContentText';
import WelcomeImageGrid from './WelcomeImageGrid';
import SearchCard from './SearchCard';

const WelcomeAndSearchSection = () => {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, sm: 4, md: 5, lg: 6 },
            maxWidth: '1700px',
            mx: 'auto',
            pb: { xs: 0, md: '120px', lg: '140px' }
        }}>

            <Box sx={{
                display: { xs: 'contents', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                position: { md: 'relative' },
                gridColumn: { md: '1' },
                zIndex: 10,
            }}>

                <Box sx={{ order: { xs: 1, md: 'unset' } }}>
                    <WelcomeContentText />
                </Box>

                <Box sx={{
                    order: { xs: 3, md: 'unset' },
                    position: { xs: 'relative', md: 'absolute' },
                    top: { md: '100%' },
                    left: { md: '0' },
                    mt: { xs: 4, md: 8 },
                    width: { xs: '100%', md: '180%', lg: '190%' },
                    maxWidth: { md: '1000px' },
                    zIndex: 20,
                }}>
                    <SearchCard />
                </Box>
            </Box>
            <WelcomeImageGrid />

        </Box>
    );
};

export default WelcomeAndSearchSection;