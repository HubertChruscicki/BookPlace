import React from 'react';
import { Box, Typography, TextField, Grid, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useAddOfferForm } from './AddOfferFormContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import KingBedIcon from '@mui/icons-material/KingBed';
import WeekendIcon from '@mui/icons-material/Weekend';

// Common text field styling matching HeaderSearch
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

const BasicDetailsStep: React.FC = () => {
    const { control, formState: { errors } } = useAddOfferForm();

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Basic Information & Details
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Provide key details about your place
            </Typography>

            <Grid container spacing={3}>
                {/* Title */}
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ 
                            required: 'Title is required',
                            minLength: { value: 5, message: 'Title must be at least 5 characters' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Title"
                                fullWidth
                                placeholder="Give your place a catchy title"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ 
                            required: 'Description is required',
                            minLength: { value: 20, message: 'Description must be at least 20 characters' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Describe what makes your place special"
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Grid>

                {/* Price per night */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="pricePerNight"
                        control={control}
                        rules={{ 
                            required: 'Price is required',
                            min: { value: 1, message: 'Price must be at least 1' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Price per night"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.pricePerNight}
                                helperText={errors.pricePerNight?.message}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                {/* Max Guests */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="maxGuests"
                        control={control}
                        rules={{ 
                            required: 'Max guests is required',
                            min: { value: 1, message: 'At least 1 guest required' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Max Guests"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.maxGuests}
                                helperText={errors.maxGuests?.message}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                {/* Rooms */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Controller
                        name="rooms"
                        control={control}
                        rules={{ 
                            required: 'Number of rooms is required',
                            min: { value: 1, message: 'At least 1 room required' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Rooms"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MeetingRoomIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.rooms}
                                helperText={errors.rooms?.message}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                {/* Bathrooms */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Controller
                        name="bathrooms"
                        control={control}
                        rules={{ 
                            required: 'Number of bathrooms is required',
                            min: { value: 1, message: 'At least 1 bathroom required' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Bathrooms"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BathtubIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.bathrooms}
                                helperText={errors.bathrooms?.message}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 2 }}>
                        Sleeping Arrangements
                    </Typography>
                </Grid>

                {/* Single Beds */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="singleBeds"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Single Beds"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SingleBedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                {/* Double Beds */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="doubleBeds"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Double Beds"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KingBedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>

                {/* Sofas */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="sofas"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Sofa Beds"
                                type="number"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WeekendIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldSx}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default BasicDetailsStep;
