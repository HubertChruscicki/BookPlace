import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    Container,
    Alert,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

import { AddOfferFormProvider, useAddOfferForm, type AddOfferFormData } from '../../components/features/offer/add-offer/AddOfferFormContext';
import OfferTypeStep from '../../components/features/offer/add-offer/OfferTypeStep';
import BasicDetailsStep from '../../components/features/offer/add-offer/BasicDetailsStep';
import AmenitiesStep from '../../components/features/offer/add-offer/AmenitiesStep';
import LocationStep from '../../components/features/offer/add-offer/LocationStep';
import ImagesStep from '../../components/features/offer/add-offer/ImagesStep';
import SummaryStep from '../../components/features/offer/add-offer/SummaryStep';
import { useCreateOffer } from '../../hooks/useOffers';
import type { CreateOfferPayload } from '../../models/OfferModels';

const STEPS = [
    { title: 'Offer Type', component: OfferTypeStep },
    { title: 'Basic Details', component: BasicDetailsStep },
    { title: 'Amenities', component: AmenitiesStep },
    { title: 'Location', component: LocationStep },
    { title: 'Photos', component: ImagesStep },
    { title: 'Review & Submit', component: SummaryStep },
];

// Validation functions for each step
const validateStep = (step: number, data: AddOfferFormData): boolean => {
    switch (step) {
        case 0: // Offer Type - must be > 0 (IDs start from 1, default unselected is -1)
            return data.offerTypeId > 0;
        case 1: // Basic Details
            return !!(
                data.title &&
                data.title.length >= 5 &&
                data.description &&
                data.description.length >= 20 &&
                data.pricePerNight > 0 &&
                data.maxGuests > 0 &&
                data.rooms > 0 &&
                data.bathrooms > 0
            );
        case 2: // Amenities (optional, always valid)
            return true;
        case 3: // Location
            return !!(
                data.addressStreet &&
                data.addressCity &&
                data.addressZipCode &&
                data.addressCountry
            );
        case 4: // Photos
            return data.photos && data.photos.length > 0;
        case 5: // Summary (review step, always valid if previous are valid)
            return true;
        default:
            return false;
    }
};

const AddOfferStepperContent: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { trigger, control } = useAddOfferForm();
    
    // useWatch with control - properly triggers re-render on any form change
    const formData = useWatch<AddOfferFormData>({ control });

    const createOfferMutation = useCreateOffer();

    const isLastStep = currentStep === STEPS.length - 1;
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const CurrentStepComponent = STEPS[currentStep].component;

    // Calculate validation based on watched formData
    const isCurrentStepValid = validateStep(currentStep, formData as AddOfferFormData);
    
    // Debug log
    console.log('Step:', currentStep, 'offerTypeId:', formData?.offerTypeId, 'isValid:', isCurrentStepValid);

    const handleNext = async () => {
        // Trigger validation for current step fields
        await trigger();
        
        console.log('HandleNext - Step:', currentStep, 'offerTypeId:', formData.offerTypeId);
        
        if (!isCurrentStepValid) {
            console.log('Validation failed for step', currentStep);
            return;
        }

        if (isLastStep) {
            handleSubmit();
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        // Helper function to strip data URL prefix and get raw Base64
        const stripBase64Prefix = (dataUrl: string): string => {
            if (dataUrl.includes(',')) {
                return dataUrl.split(',')[1];
            }
            return dataUrl;
        };

        // Prepare payload with type assertion (validated before reaching this point)
        const payload: CreateOfferPayload = {
            title: formData?.title || '',
            description: formData?.description || '',
            pricePerNight: formData?.pricePerNight || 0,
            maxGuests: formData?.maxGuests || 1,
            rooms: formData?.rooms || 1,
            singleBeds: formData?.singleBeds || 0,
            doubleBeds: formData?.doubleBeds || 0,
            sofas: formData?.sofas || 0,
            bathrooms: formData?.bathrooms || 1,
            offerTypeId: formData?.offerTypeId || 0,
            amenityIds: formData?.amenityIds || [],
            addressStreet: formData?.addressStreet || '',
            addressCity: formData?.addressCity || '',
            addressZipCode: formData?.addressZipCode || '',
            addressCountry: formData?.addressCountry || '',
            addressLatitude: formData?.addressLatitude || 0,
            addressLongitude: formData?.addressLongitude || 0,
            photos: (formData?.photos || []).map(p => ({
                base64Data: stripBase64Prefix(p.base64Data || ''),
                isCover: p.isCover || false,
            })),
        };

        try {
            await createOfferMutation.mutateAsync(payload);
            navigate('/host/offers');
        } catch (error) {
            setSubmitError('Failed to create offer. Please try again.');
            console.error('Create offer error:', error);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    py: 2,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {STEPS[currentStep].title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Step {currentStep + 1} of {STEPS.length}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                    },
                }}
            />

            {/* Content */}
            <Box sx={{ flex: 1, py: 4 }}>
                <Container maxWidth="md">
                    {submitError && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
                            {submitError}
                        </Alert>
                    )}
                    <CurrentStepComponent />
                </Container>
            </Box>

            {/* Footer Navigation */}
            <Box
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    py: 2,
                    position: 'sticky',
                    bottom: 0,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            variant="text"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            endIcon={
                                createOfferMutation.isPending ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : isLastStep ? (
                                    <CheckIcon />
                                ) : (
                                    <ArrowForwardIcon />
                                )
                            }
                            onClick={handleNext}
                            disabled={!isCurrentStepValid || createOfferMutation.isPending}
                            sx={{
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: 25,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {createOfferMutation.isPending
                                ? 'Creating...'
                                : isLastStep
                                ? 'Publish Offer'
                                : 'Next'}
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

// Wrapper with FormProvider
const AddOfferPage: React.FC = () => {
    return (
        <AddOfferFormProvider>
            <AddOfferStepperContent />
        </AddOfferFormProvider>
    );
};

export default AddOfferPage;
