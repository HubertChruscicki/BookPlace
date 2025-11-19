import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slider,
    Box,
    Chip,
    IconButton,
    Divider,
    Alert,
    CircularProgress,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAmenities } from '../../../hooks/useOffers';
import type { Amenity } from '../../../models/OfferModels';

export interface FilterValues {
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
    singleBeds?: number;
    doubleBeds?: number;
    sofas?: number;
    bathrooms?: number;
    amenities?: number[];
}

interface FiltersModalProps {
    open: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterValues) => void;
    initialFilters?: FilterValues;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
    open,
    onClose,
    onApplyFilters,
    initialFilters = {}
}) => {
    const { data: amenities, isLoading: amenitiesLoading, isError: amenitiesError } = useAmenities();
    
    const [priceRange, setPriceRange] = useState<number[]>([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 1000
    ]);
    
    const [minPriceInput, setMinPriceInput] = useState<string>(
        initialFilters.minPrice?.toString() || ''
    );
    const [maxPriceInput, setMaxPriceInput] = useState<string>(
        initialFilters.maxPrice?.toString() || ''
    );
    
    const [rooms, setRooms] = useState(initialFilters.rooms || 0);
    const [singleBeds, setSingleBeds] = useState(initialFilters.singleBeds || 0);
    const [doubleBeds, setDoubleBeds] = useState(initialFilters.doubleBeds || 0);
    const [sofas, setSofas] = useState(initialFilters.sofas || 0);
    const [bathrooms, setBathrooms] = useState(initialFilters.bathrooms || 0);
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
        initialFilters.amenities || []
    );

    const handlePriceChange = (_: Event, newValue: number | number[]) => {
        const range = newValue as number[];
        setPriceRange(range);
        setMinPriceInput(range[0] > 0 ? range[0].toString() : '');
        setMaxPriceInput(range[1] < 1000 ? range[1].toString() : '');
    };

    const handleMinPriceInputChange = (value: string) => {
        setMinPriceInput(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setPriceRange([numValue, Math.max(numValue, priceRange[1])]);
        }
    };

    const handleMaxPriceInputChange = (value: string) => {
        setMaxPriceInput(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setPriceRange([Math.min(priceRange[0], numValue), numValue]);
        }
    };

    const handleCounterChange = (
        type: 'rooms' | 'singleBeds' | 'doubleBeds' | 'sofas' | 'bathrooms',
        increment: boolean
    ) => {
        const setterMap = {
            rooms: setRooms,
            singleBeds: setSingleBeds,
            doubleBeds: setDoubleBeds,
            sofas: setSofas,
            bathrooms: setBathrooms
        };
        
        const valueMap = {
            rooms,
            singleBeds,
            doubleBeds,
            sofas,
            bathrooms
        };

        const currentValue = valueMap[type];
        const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
        setterMap[type](newValue);
    };

    const handleAmenityToggle = (amenityId: number) => {
        setSelectedAmenities(prev => 
            prev.includes(amenityId) 
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const handleClearAll = () => {
        setPriceRange([0, 1000]);
        setMinPriceInput('');
        setMaxPriceInput('');
        setRooms(0);
        setSingleBeds(0);
        setDoubleBeds(0);
        setSofas(0);
        setBathrooms(0);
        setSelectedAmenities([]);
    };

    const handleApply = () => {
        const filters: FilterValues = {
            minPrice: minPriceInput ? parseFloat(minPriceInput) : undefined,
            maxPrice: maxPriceInput ? parseFloat(maxPriceInput) : undefined,
            rooms: rooms > 0 ? rooms : undefined,
            singleBeds: singleBeds > 0 ? singleBeds : undefined,
            doubleBeds: doubleBeds > 0 ? doubleBeds : undefined,
            sofas: sofas > 0 ? sofas : undefined,
            bathrooms: bathrooms > 0 ? bathrooms : undefined,
            amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined
        };
        
        onApplyFilters(filters);
        onClose();
    };

    const CounterControl = ({ 
        label, 
        value, 
        type 
    }: { 
        label: string; 
        value: number; 
        type: 'rooms' | 'singleBeds' | 'doubleBeds' | 'sofas' | 'bathrooms';
    }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
            <Typography>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                    size="small" 
                    onClick={() => handleCounterChange(type, false)}
                    disabled={value === 0}
                    sx={{ 
                        border: 1, 
                        borderColor: 'grey.300',
                        '&:disabled': { borderColor: 'grey.200' }
                    }}
                >
                    <RemoveIcon fontSize="small" />
                </IconButton>
                <Box sx={{ minWidth: '80px', textAlign: 'center' }}>
                    <Typography>
                        {value === 0 ? 'Any' : value}
                    </Typography>
                </Box>
                <IconButton 
                    size="small" 
                    onClick={() => handleCounterChange(type, true)}
                    sx={{ border: 1, borderColor: 'grey.300' }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, maxHeight: '80vh', maxWidth: '600px' },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight="bold">Filters</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ py: 3 }}>
                {/* Price Range Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Price range per night</Typography>
                    
                    <Box sx={{ px: 1, mt: 2 }}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                            step={10}
                            valueLabelFormat={(value) => `$${value}`}
                            sx={{
                                '& .MuiSlider-thumb': {
                                    height: 24,
                                    width: 24,
                                },
                                '& .MuiSlider-track': {
                                    height: 4,
                                },
                                '& .MuiSlider-rail': {
                                    height: 4,
                                }
                            }}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Box sx={{ flex: 1, maxWidth: 80, textAlign: 'left' }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>Minimum</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="$0"
                                value={minPriceInput}
                                onChange={(e) => handleMinPriceInputChange(e.target.value)}
                                type="number"
                                InputProps={{
                                    startAdornment: minPriceInput ? '$' : '',
                                    sx: {
                                        borderRadius: 20,
                                        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                                            '-webkit-appearance': 'none',
                                            margin: 0,
                                        },
                                        '& input[type=number]': {
                                            '-moz-appearance': 'textfield',
                                        },
                                    }
                                }}
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, maxWidth: 80, textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>Maximum</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="$1000+"
                                value={maxPriceInput}
                                onChange={(e) => handleMaxPriceInputChange(e.target.value)}
                                type="number"
                                InputProps={{
                                    startAdornment: maxPriceInput ? '$' : '',
                                    sx: {
                                        borderRadius: 20,
                                        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                                            '-webkit-appearance': 'none',
                                            margin: 0,
                                        },
                                        '& input[type=number]': {
                                            '-moz-appearance': 'textfield',
                                        }
                                    }
                                }}
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Rooms and Beds Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Rooms and beds</Typography>
                    
                    <CounterControl label="Bedrooms" value={rooms} type="rooms" />
                    <CounterControl label="Single beds" value={singleBeds} type="singleBeds" />
                    <CounterControl label="Double beds" value={doubleBeds} type="doubleBeds" />
                    <CounterControl label="Sofas" value={sofas} type="sofas" />
                    <CounterControl label="Bathrooms" value={bathrooms} type="bathrooms" />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Amenities Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Amenities</Typography>
                    
                    {amenitiesLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    
                    {amenitiesError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Failed to load amenities
                        </Alert>
                    )}
                    
                    {amenities && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {amenities.map((amenity: Amenity) => (
                                <Chip
                                    key={amenity.id}
                                    label={amenity.name}
                                    onClick={() => handleAmenityToggle(amenity.id)}
                                    variant={selectedAmenities.includes(amenity.id) ? "filled" : "outlined"}
                                    color={selectedAmenities.includes(amenity.id) ? "primary" : "default"}
                                    sx={{
                                        borderRadius: 3,
                                        '&:hover': {
                                            backgroundColor: selectedAmenities.includes(amenity.id) 
                                                ? 'primary.dark' 
                                                : 'grey.100'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                <Button 
                    variant="text" 
                    onClick={handleClearAll}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Clear all
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleApply}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 4
                    }}
                >
                    Show places
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FiltersModal;

