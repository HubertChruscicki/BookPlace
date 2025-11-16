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
import { useNavigate } from "react-router-dom";

const mockDestinations = [
    'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań',
    'Szczecin', 'Lublin', 'Katowice', 'Białystok', 'Toruń'
];

const SearchCard = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState(''); 
    const [guests, setGuests] = useState('');

    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (selectedLocation) {
            params.set('City', selectedLocation);
        }
        if (checkIn) {
            params.set('CheckInDate', checkIn);
        }
        if (checkOut) { 
            params.set('CheckOutDate', checkOut);
        }
        if (guests) {
            params.set('Guests', guests);
        }

        params.set('PageNumber', '1');
        params.set('PageSize', '12');

        navigate(`/search?${params.toString()}`);
    };

    return (
        <Card sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            width: '100%',
        }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr auto' },
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
                        Check In
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
                        InputLabelProps={{ shrink: true }}
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
                        Check Out
                    </Typography>
                    <TextField
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{ shrink: true }}
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

                <Box sx={{ gridColumn: { xs: 'span 2', md: 'span 1' } }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                        Guest
                    </Typography>
                    <TextField
                        placeholder="0 Guest"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
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