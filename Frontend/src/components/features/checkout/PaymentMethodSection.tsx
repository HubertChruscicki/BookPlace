// src/components/features/checkout/PaymentMethodSection.tsx

import React from 'react';
import { Box, FormControlLabel, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface PaymentMethodSectionProps {
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
}

const PAYMENT_OPTIONS = [
    { value: 'card', label: 'Credit / Debit card', icon: <CreditCardIcon color="primary" /> },
    { value: 'blik', label: 'BLIK Instant transfer', icon: (
            <Box component="img" src="/blik.png" alt="BLIK" sx={{ width: 40, height: 24, objectFit: 'contain' }} />
        )},
    { value: 'bank', label: 'Traditional bank transfer', icon: <AccountBalanceIcon color="primary" /> },
];

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Payment method</Typography>
            <RadioGroup
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
            >
                {PAYMENT_OPTIONS.map(option => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {option.icon}
                                <Typography>{option.label}</Typography>
                            </Box>
                        }
                        sx={{ my: 1 }}
                    />
                ))}
            </RadioGroup>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Secure checkout powered by BookPlace. You will be charged only after the host confirms the reservation.
            </Typography>
        </Paper>
    );
};

export default PaymentMethodSection;