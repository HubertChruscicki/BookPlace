import React from 'react';
import { Box, Typography, Grid, Divider, Chip, Alert } from '@mui/material';
import { useAddOfferForm } from './AddOfferFormContext';
import { useOfferTypes, useAmenities } from '../../../../hooks/useOffers';
import { getAmenityIcon } from '../../../../utils/amenityIcons';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HotelIcon from '@mui/icons-material/Hotel';

const SummaryStep: React.FC = () => {
    const { watch, formState: { isValid } } = useAddOfferForm();
    const formData = watch();
    
    const { data: offerTypes } = useOfferTypes();
    const { data: amenities } = useAmenities();

    const selectedOfferType = offerTypes?.find(t => t.id === formData.offerTypeId);
    const selectedAmenities = amenities?.filter(a => formData.amenityIds.includes(a.id)) || [];

    const totalBeds = formData.singleBeds + formData.doubleBeds + formData.sofas;

    // Validation check
    const validationErrors: string[] = [];
    if (!formData.offerTypeId) validationErrors.push('Offer type is not selected');
    if (!formData.title) validationErrors.push('Title is missing');
    if (!formData.description || formData.description.length < 20) validationErrors.push('Description is too short');
    if (!formData.pricePerNight || formData.pricePerNight < 1) validationErrors.push('Price is not set');
    if (!formData.addressStreet) validationErrors.push('Street address is missing');
    if (!formData.addressCity) validationErrors.push('City is missing');
    if (!formData.addressCountry) validationErrors.push('Country is missing');
    if (!formData.photos || formData.photos.length === 0) validationErrors.push('No photos uploaded');

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Review & Submit
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Review your listing before publishing
            </Typography>

            {validationErrors.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Please complete the following before submitting:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* Cover Photo Preview */}
            {formData.photos.length > 0 && (
                <Box sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                    <img
                        src={formData.photos.find(p => p.isCover)?.base64Data || formData.photos[0].base64Data}
                        alt="Cover"
                        style={{
                            width: '100%',
                            height: 250,
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            )}

            {/* Basic Info Card */}
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    {formData.title || 'Untitled Listing'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip 
                        label={selectedOfferType?.name || 'Not selected'} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {formData.description || 'No description provided'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Price</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    ${formData.pricePerNight}/night
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Guests</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formData.maxGuests}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MeetingRoomIcon sx={{ color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Rooms</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formData.rooms}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BathtubIcon sx={{ color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bathrooms</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formData.bathrooms}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HotelIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">
                        {totalBeds} bed{totalBeds !== 1 ? 's' : ''}: {formData.singleBeds} single, {formData.doubleBeds} double, {formData.sofas} sofa
                    </Typography>
                </Box>
            </Box>

            {/* Location Card */}
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                    <Box>
                        <Typography variant="body1">
                            {formData.addressStreet || 'Street not provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {formData.addressCity && formData.addressZipCode 
                                ? `${formData.addressCity}, ${formData.addressZipCode}`
                                : 'City not provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {formData.addressCountry || 'Country not provided'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Amenities Card */}
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Amenities ({selectedAmenities.length})
                </Typography>
                {selectedAmenities.length > 0 ? (
                    <Grid container spacing={1}>
                        {selectedAmenities.map((amenity) => {
                            const Icon = getAmenityIcon(amenity.id);
                            return (
                                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={amenity.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                        <Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                        <Typography variant="body2">{amenity.name}</Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No amenities selected
                    </Typography>
                )}
            </Box>

            {/* Photos Card */}
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Photos ({formData.photos.length})
                </Typography>
                {formData.photos.length > 0 ? (
                    <Grid container spacing={1}>
                        {formData.photos.map((photo, index) => (
                            <Grid size={{ xs: 4, sm: 2 }} key={index}>
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        aspectRatio: '1',
                                        border: photo.isCover ? '2px solid' : '1px solid',
                                        borderColor: photo.isCover ? 'primary.main' : 'divider',
                                    }}
                                >
                                    <img
                                        src={photo.base64Data}
                                        alt={`Photo ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No photos uploaded
                    </Typography>
                )}
            </Box>

            {!isValid && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Please complete all required fields before submitting.
                </Alert>
            )}
        </Box>
    );
};

export default SummaryStep;
