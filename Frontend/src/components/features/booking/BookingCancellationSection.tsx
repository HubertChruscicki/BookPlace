import React from 'react';
import { Typography, Button, Paper, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PolicyIcon from '@mui/icons-material/Policy';

interface BookingCancellationSectionProps {
    canCancel: boolean;
}

const BookingCancellationSection: React.FC<BookingCancellationSectionProps> = ({ canCancel }) => {

    const handleCancelBooking = () => {
        if (window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
            console.log("Cancelling reservation...");
        }
    };

    return (
        <Stack spacing={3}>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <PolicyIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Cancellation Policy Details
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Free cancellation within 48 hours of booking. After that, receive a 50% refund up until 7 days before check-in. By continuing you agree to the house rules and BookPlace terms of service.
                </Typography>
            </Paper>

            {canCancel && (
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="h6" fontWeight={700} color="error.main">
                            Cancel Reservation
                        </Typography>
                        <IconButton size="small" color="error">
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Remember that you can cancel free of charge only within 48 hours of booking. Check the full policy for potential fees.
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        size="large"
                        onClick={handleCancelBooking}
                        sx={{
                            borderRadius: 25,
                            textTransform: 'none',
                            fontWeight: 700,
                            py: 1,
                        }}
                    >
                        Confirm Cancellation
                    </Button>
                </Paper>
            )}
        </Stack>
    );
};

export default BookingCancellationSection;