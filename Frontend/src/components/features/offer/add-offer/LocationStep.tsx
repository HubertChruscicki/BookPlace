import React from 'react';
import { Box, Typography, TextField, Grid, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useAddOfferForm } from './AddOfferFormContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';

// Common text field styling
const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        bgcolor: 'background.paper',
        '& fieldset': {
            borderColor: 'divider',
        },
        '&:hover fieldset': {
            borderColor: 'text.secondary',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
        },
    },
    '& .MuiInputLabel-root': {
        fontWeight: 500,
    },
};

const LocationStep: React.FC = () => {
    const { control, setValue, formState: { errors } } = useAddOfferForm();

    // Generate mock coordinates based on city (for demo purposes)
    const generateMockCoordinates = (city: string) => {
        const cityCoords: Record<string, { lat: number; lng: number }> = {
            'warszawa': { lat: 52.2297, lng: 21.0122 },
            'krakow': { lat: 50.0647, lng: 19.9450 },
            'kraków': { lat: 50.0647, lng: 19.9450 },
            'gdansk': { lat: 54.3520, lng: 18.6466 },
            'gdańsk': { lat: 54.3520, lng: 18.6466 },
            'wroclaw': { lat: 51.1079, lng: 17.0385 },
            'wrocław': { lat: 51.1079, lng: 17.0385 },
            'poznan': { lat: 52.4064, lng: 16.9252 },
            'poznań': { lat: 52.4064, lng: 16.9252 },
        };
        
        const normalizedCity = city.toLowerCase().trim();
        const coords = cityCoords[normalizedCity] || { lat: 52.2297, lng: 21.0122 };
        
        // Add small random offset for variety
        return {
            lat: coords.lat + (Math.random() - 0.5) * 0.02,
            lng: coords.lng + (Math.random() - 0.5) * 0.02,
        };
    };

    const handleCityChange = (city: string) => {
        const coords = generateMockCoordinates(city);
        setValue('addressLatitude', coords.lat);
        setValue('addressLongitude', coords.lng);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Location
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Where is your place located?
            </Typography>

            <Grid container spacing={3}>
                {/* Street Address */}
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="addressStreet"
                        control={control}
                        rules={{ required: 'Street address is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Street Address"
                                fullWidth
                                placeholder="e.g., 123 Main Street, Apt 4B"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.addressStreet}
                                helperText={errors.addressStreet?.message}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Grid>

                {/* City */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="addressCity"
                        control={control}
                        rules={{ required: 'City is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="City"
                                fullWidth
                                placeholder="e.g., Warsaw"
                                error={!!errors.addressCity}
                                helperText={errors.addressCity?.message}
                                sx={textFieldSx}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleCityChange(e.target.value);
                                }}
                            />
                        )}
                    />
                </Grid>

                {/* Zip Code */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="addressZipCode"
                        control={control}
                        rules={{ required: 'Zip code is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Zip Code"
                                fullWidth
                                placeholder="e.g., 00-001"
                                error={!!errors.addressZipCode}
                                helperText={errors.addressZipCode?.message}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Grid>

                {/* Country */}
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="addressCountry"
                        control={control}
                        rules={{ required: 'Country is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Country"
                                fullWidth
                                placeholder="e.g., Poland"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PublicIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.addressCountry}
                                helperText={errors.addressCountry?.message}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Box 
                sx={{ 
                    mt: 4, 
                    p: 2, 
                    bgcolor: 'grey.100', 
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider'
                }}
            >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    📍 Coordinates will be automatically generated based on the city you enter. 
                    In a production environment, this would use a geocoding service.
                </Typography>
            </Box>
        </Box>
    );
};

export default LocationStep;
