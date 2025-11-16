import { Box } from '@mui/material';
import WelcomeAndSearchSection from "../components/features/welcome-search/WelcomeAndSearchSection.tsx";

const LandingPage = () => {
    return (
        <Box 
            sx={{
            width: '100%',
            minHeight: '100vh',
            overflowX: 'hidden',
            py: { xs: 3, md: 6 }
        }}>
            <WelcomeAndSearchSection />
        </Box>
    );
};

export default LandingPage;