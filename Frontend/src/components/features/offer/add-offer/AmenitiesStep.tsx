import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useAddOfferForm, type AddOfferFormData } from './AddOfferFormContext';
import { useAmenities } from '../../../../hooks/useOffers';
import { getAmenityIcon } from '../../../../utils/amenityIcons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AmenitiesStep: React.FC = () => {
    const { setValue, control } = useAddOfferForm();
    
    // useWatch triggers re-render when value changes
    const selectedAmenities = useWatch<AddOfferFormData, 'amenityIds'>({
        control,
        name: 'amenityIds',
    }) || [];
    
    const { data: amenities, isLoading, isError } = useAmenities();

    const handleToggleAmenity = (amenityId: number) => {
        const currentAmenities = [...selectedAmenities];
        const isSelected = currentAmenities.includes(amenityId);
        
        console.log('Toggle amenity:', amenityId, 'Current:', currentAmenities, 'isSelected:', isSelected);
        
        if (isSelected) {
            const newAmenities = currentAmenities.filter(id => id !== amenityId);
            setValue('amenityIds', newAmenities, { shouldValidate: true, shouldDirty: true });
        } else {
            const newAmenities = [...currentAmenities, amenityId];
            setValue('amenityIds', newAmenities, { shouldValidate: true, shouldDirty: true });
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !amenities) {
        return <Alert severity="error">Failed to load amenities</Alert>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexShrink: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Amenities
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    Select the amenities your place offers
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
                    ✓ Selected: {selectedAmenities.length} amenities
                </Typography>
            </Box>

            {/* Scrollable amenities container */}
            <Box 
                sx={{ 
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 350px)',
                    minHeight: 300,
                    pr: 1,
                    // Custom scrollbar styling
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        bgcolor: 'grey.100',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'grey.400',
                        borderRadius: '4px',
                        '&:hover': {
                            bgcolor: 'grey.500',
                        },
                    },
                }}
            >
                <Grid container spacing={2}>
                    {amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity.id);
                        const isSelected = selectedAmenities.includes(amenity.id);

                        return (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={amenity.id}>
                                <Box
                                    onClick={() => handleToggleAmenity(amenity.id)}
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 2,
                                        borderRadius: 3,
                                        border: isSelected ? '3px solid' : '2px solid',
                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                        bgcolor: isSelected ? 'rgba(8, 108, 243, 0.1)' : 'background.paper',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        minHeight: 100,
                                        boxShadow: isSelected ? '0 0 0 4px rgba(8, 108, 243, 0.15)' : 'none',
                                        '&:hover': {
                                            borderColor: isSelected ? 'primary.main' : 'grey.400',
                                            transform: 'scale(1.02)',
                                            boxShadow: isSelected 
                                                ? '0 0 0 4px rgba(8, 108, 243, 0.25)' 
                                                : '0 4px 12px rgba(0,0,0,0.1)',
                                            bgcolor: isSelected ? 'rgba(8, 108, 243, 0.15)' : 'grey.50',
                                        },
                                    }}
                                >
                                    {/* Checkmark badge for selected */}
                                    {isSelected && (
                                        <CheckCircleIcon 
                                            sx={{ 
                                                position: 'absolute',
                                                top: 6,
                                                right: 6,
                                                fontSize: 20,
                                                color: 'primary.main',
                                            }} 
                                        />
                                    )}
                                    <Icon 
                                        sx={{ 
                                            fontSize: 28, 
                                            mb: 1,
                                            color: isSelected ? 'primary.main' : 'text.primary',
                                        }} 
                                    />
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: isSelected ? 600 : 500,
                                            color: isSelected ? 'primary.main' : 'text.primary',
                                            textAlign: 'center',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {amenity.name}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default AmenitiesStep;
