import React from 'react';
import { Box, Typography, Button, Avatar, Paper, Stack, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import type { BookingHost } from '../../../models/BookingModels';

interface BookingHostSectionProps {
    host: BookingHost;
}

const BookingHostSection: React.FC<BookingHostSectionProps> = ({ host }) => {
    return (
        <Paper
            elevation={4} 
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem' }}>
                Your Host
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                    src={host.avatarUrl || undefined}
                    alt={host.name}
                    sx={{ width: 56, height: 56 }}
                />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {host.name}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Stack direction={"row"} spacing={1.5}>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ChatIcon />}
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                        }
                    }}
                >
                    Message
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EmailIcon />}
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                        }
                    }}
                >
                    Email
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PhoneIcon />}
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                        }
                    }}
                >
                    Call
                </Button>
            </Stack>
        </Paper>
    );
};

export default BookingHostSection;