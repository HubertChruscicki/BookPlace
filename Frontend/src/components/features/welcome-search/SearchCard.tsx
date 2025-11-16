// src/features/welcome-search/SearchCard.tsx
import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {theme} from "../../../theme.ts";

const mockDestinations = [
    'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań',
    'Szczecin', 'Lublin', 'Katowice', 'Białystok', 'Toruń'
];
const SearchCard = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState('');

    const handleSearch = () => {
        console.log('Searching...');
    };

    return (
        <Card sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: theme.palette.background.default,
            backdropFilter: 'blur(10px)',
            width: '100%',
        }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr auto' },
                gap: 2,
                alignItems: 'end'
            }}>
                <Box sx={{ gridColumn: { xs: 'span 2', md: 'span 1' } }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                        Location
                    </Typography>
                    <Autocomplete
                        options={mockDestinations}
                        value={selectedLocation}
                        onChange={(_, newValue) => setSelectedLocation(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Your Location"
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        '&:hover fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                        Date
                    </Typography>
                    <TextField
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                '&:hover fieldset': { borderColor: 'primary.main' }
                            }
                        }}
                    />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                        Guest
                    </Typography>
                    <TextField
                        placeholder="0 Guest"
                        variant="outlined"
                        size="small"
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                '&:hover fieldset': { borderColor: 'primary.main' }
                            }
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    sx={{
                        gridColumn: { xs: 'span 2', md: 'unset' },
                        height: '48px',
                        borderRadius: '12px',
                        px: 3,
                        background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                        }
                    }}
                >
                    Search
                </Button>
            </Box>
        </Card>
    );
};

export default SearchCard;