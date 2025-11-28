import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useAddOfferForm, type AddOfferFormData } from './AddOfferFormContext';
import { useOfferTypes } from '../../../../hooks/useOffers';
import { getOfferTypeIcon, getOfferTypeIconByName } from '../../../../utils/offerTypeIcons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OfferTypeStep: React.FC = () => {
    const { setValue, control, formState: { errors } } = useAddOfferForm();
    
    // useWatch triggers re-render when value changes
    const selectedTypeId = useWatch<AddOfferFormData, 'offerTypeId'>({
        control,
        name: 'offerTypeId',
    });
    
    const { data: offerTypes, isLoading, isError } = useOfferTypes();

    const handleSelectType = (typeId: number) => {
        console.log('Selecting type:', typeId, 'Current:', selectedTypeId);
        setValue('offerTypeId', typeId, { shouldValidate: true, shouldDirty: true });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !offerTypes) {
        return <Alert severity="error">Failed to load offer types</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Select Offer Type
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Which type of place will you host?
            </Typography>

            <Grid container spacing={2}>
                {offerTypes.map((type) => {
                    // Try ID-based icon first, then name-based fallback
                    const Icon = getOfferTypeIcon(type.id) || getOfferTypeIconByName(type.name);
                    const isSelected = selectedTypeId === type.id;

                    return (
                        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={type.id}>
                            <Box
                                onClick={() => handleSelectType(type.id)}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 3,
                                    borderRadius: 3,
                                    border: isSelected ? '3px solid' : '2px solid',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'rgba(8, 108, 243, 0.1)' : 'background.paper',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    minHeight: 120,
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
                                            top: 8,
                                            right: 8,
                                            fontSize: 24,
                                            color: 'primary.main',
                                        }} 
                                    />
                                )}
                                <Icon 
                                    sx={{ 
                                        fontSize: 40, 
                                        mb: 1,
                                        color: isSelected ? 'primary.main' : 'text.primary',
                                    }} 
                                />
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontWeight: isSelected ? 700 : 600,
                                        color: isSelected ? 'primary.main' : 'text.primary',
                                        textAlign: 'center',
                                    }}
                                >
                                    {type.name}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {errors.offerTypeId && (
                <Typography color="error" sx={{ mt: 2 }}>
                    Please select an offer type
                </Typography>
            )}

            {selectedTypeId > 0 && (
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mt: 3 }}>
                    ✓ Selected: {offerTypes.find(t => t.id === selectedTypeId)?.name}
                </Typography>
            )}
        </Box>
    );
};

export default OfferTypeStep;