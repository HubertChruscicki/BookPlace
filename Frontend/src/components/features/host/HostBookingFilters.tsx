import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import React from 'react';
import type { HostBookingFilters } from '../../../models/HostModels';

interface HostBookingFiltersProps {
    filters: HostBookingFilters;
    onStatusChange: (event: React.MouseEvent<HTMLElement> | { target: { value: string } }, newStatus: string | null) => void;
}

const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'canceled', label: 'Canceled' },
];

export default function HostBookingFilters({ filters, onStatusChange }: HostBookingFiltersProps) {
    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                    Bookings
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Manage your bookings
                </Typography>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }} mb={4}>
                <FormControl fullWidth size="medium">
                    <InputLabel id="booking-status-select-label" sx={{ fontWeight: 600 }}>Booking Status</InputLabel>
                    <Select
                        labelId="booking-status-select-label"
                        id="booking-status-select"
                        value={filters.status}
                        label="Booking Status"
                        onChange={(e) => onStatusChange(e as any, e.target.value)}
                        sx={{ borderRadius: 25, fontWeight: 700 }}
                        MenuProps={{
                            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                            transformOrigin: { vertical: 'top', horizontal: 'left' },
                        }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 600 }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box mb={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                <ToggleButtonGroup
                    value={filters.status}
                    exclusive
                    onChange={onStatusChange as any}
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: 25,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 1,
                            border: '1px solid',
                            borderColor: 'grey.200',
                            '&:not(:last-of-type)': {
                                borderRight: '1px solid',
                                borderRightColor: 'grey.200',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            },
                        },
                    }}
                >
                    {statusOptions.map((option) => (
                        <ToggleButton key={option.value} value={option.value} sx={{ fontWeight: 700, textTransform: 'none' }}>
                            {option.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
        </>
    );
}