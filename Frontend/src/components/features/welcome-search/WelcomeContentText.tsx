import { Box, Typography } from '@mui/material';

const WelcomeContentText = () => {
    return (
        <Box>
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1, 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                }}
            >
                Visit The Most
            </Typography>

            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main', 
                    mb: 1, 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                }}
            >
                Beautiful Places
            </Typography>

            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                }}
            >
                In The World
            </Typography>


            <Typography
                variant="body1"
                sx={{
                    color: 'text.secondary',
                    fontSize: '1.3rem',
                    lineHeight: 1.6,
                    maxWidth: '550px'
                }}
            >
                Plan And Book Your Perfect Trip With Expert Advice. Travel Tips, Destination Information And Inspiration From Us. 
            </Typography>
        </Box>
    );
};

export default WelcomeContentText;