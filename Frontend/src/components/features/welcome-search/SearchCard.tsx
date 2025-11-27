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
    Search as SearchIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

const mockDestinations = [
    'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań',
    'Szczecin', 'Lublin', 'Katowice', 'Białystok', 'Toruń'
];

const SearchCard = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState('');

    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (selectedLocation) params.set('City', selectedLocation);
        if (checkIn) params.set('CheckInDate', checkIn.format('YYYY-MM-DD'));
        if (checkOut) params.set('CheckOutDate', checkOut.format('YYYY-MM-DD'));
        if (guests) params.set('Guests', guests);

        params.set('PageNumber', '1');
        params.set('PageSize', '12');

        navigate(`/search?${params.toString()}`);
    };

    const inputSx = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '12px',
            height: '56px',
            '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
                borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
            }
        },
        '& .MuiInputBase-input': {
            height: '100%',
            boxSizing: 'border-box',
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{
                p: { xs: 2, md: 3 },
                mt: { xs: -3, md: 3 },
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                overflow: 'visible',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '2fr 1.5fr 1.5fr 1fr auto'
                    },
                    gap: 2,
                    alignItems: 'end'
                }}>

                    <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 0.5 }}>
                            Location
                        </Typography>
                        <Autocomplete
                            options={mockDestinations}
                            value={selectedLocation}
                            onChange={(_, newValue) => setSelectedLocation(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Where are you going?"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputSx}
                                />
                            )}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 0.5 }}>
                            Check In
                        </Typography>
                        <DatePicker
                            value={checkIn}
                            onChange={(newValue) => setCheckIn(newValue)}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    placeholder: 'Add date',
                                    sx: inputSx
                                }
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 0.5 }}>
                            Check Out
                        </Typography>
                        <DatePicker
                            value={checkOut}
                            onChange={(newValue) => setCheckOut(newValue)}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    placeholder: 'Add date',
                                    sx: inputSx
                                }
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 0.5 }}>
                            Guests
                        </Typography>
                        <TextField
                            placeholder="Add guests"
                            type="number"
                            variant="outlined"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={inputSx}
                        />
                    </Box>

                    <Box sx={{
                        gridColumn: { xs: 'span 1', sm: 'span 2', md: 'auto' },
                        display: 'flex',
                        alignItems: 'end',
                        height: '100%' 
                    }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                            sx={{
                                height: '56px', 
                                width: { xs: '100%', md: 'auto' },
                                minWidth: '140px',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                }
                            }}
                        >
                            Search
                        </Button>
                    </Box>

                </Box>
            </Card>
        </LocalizationProvider>
    );
};

export default SearchCard;