import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box,
    Autocomplete,
    InputAdornment,
    IconButton,
    useTheme,
    type TextFieldProps,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from "react-router-dom";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const mockDestinations = [
    'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań',
    'Szczecin', 'Lublin', 'Katowice', 'Białystok', 'Toruń'
];

interface MobileSearchModalProps {
    open: boolean;
    onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ open, onClose }) => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState('');

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (open) {
            const city = searchParams.get('City');
            const checkInDate = searchParams.get('CheckInDate');
            const checkOutDate = searchParams.get('CheckOutDate');
            const guestsParam = searchParams.get('Guests');

            setSelectedLocation(city || null);
            setCheckIn(checkInDate ? dayjs(checkInDate) : null);
            setCheckOut(checkOutDate ? dayjs(checkOutDate) : null);
            setGuests(guestsParam || '');
        }
    }, [searchParams, open]);
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (selectedLocation) {
            params.set('City', selectedLocation);
        }
        if (checkIn) {
            params.set('CheckInDate', checkIn.format('YYYY-MM-DD'));
        }
        if (checkOut) {
            params.set('CheckOutDate', checkOut.format('YYYY-MM-DD'));
        }
        if (guests) {
            params.set('Guests', guests);
        }

        params.set('PageNumber', '1');
        params.set('PageSize', '12');

        navigate(`/search?${params.toString()}`);
        onClose();
    };

    const handleClear = () => {
        setSelectedLocation(null);
        setCheckIn(null);
        setCheckOut(null);
        setGuests('');
    };

    const datePickerTextFieldProps = (label: string): TextFieldProps => ({
        label,
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
        InputProps: {
            readOnly: true,
        },
        placeholder: 'dd/mm/yyyy',
        sx: {
            '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
                order: -1,          
                marginRight: 2,
                marginLeft: -1.5,    
            },

            '& .MuiInputAdornment-positionEnd:not(.MuiInputAdornment-root)': {
                display: 'none !important',
            },
            
            
            '& .MuiPickersInputBase-root.MuiPickersOutlinedInput-root, & .MuiPickersOutlinedInput-root': {
                borderRadius: '12px',
                overflow: 'hidden',
            },
            borderRadius: '50px',
            fontFamily: theme.typography.fontFamily,
            '& .MuiInputBase-root': {
                fontWeight: 500,
                color: theme.palette.text.primary,
            },
            '& .MuiPickersInputBase-root': { marginTop: 0, width: '100%', px: 2, py: 1 },
            '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
            },
            '& label': {
                fontSize: "0.9rem",
                fontWeight: 500,
                color: theme.palette.text.secondary,
                top: '50%',
                transform: 'translateY(-50%)',
                px:6
            },
            '& .MuiInputLabel-shrink': {
                opacity: 0,
            }
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '80vh',
                        mx: 2
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">Search</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
                                Where
                            </Typography>
                            <Autocomplete
                                fullWidth
                                options={mockDestinations}
                                value={selectedLocation}
                                onChange={(_, newValue) => setSelectedLocation(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search destinations"
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationIcon sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: 'background.paper',
                                                height: '56px', 
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main'
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>


                        <Box sx={{ width: '100%' }}>
                            <DatePicker
                                value={checkIn}
                                onChange={(newValue) => setCheckIn(newValue)}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: datePickerTextFieldProps('Check in')
                                }}
                            />
                        </Box>


                        <Box sx={{ width: '100%' }}>
                            <DatePicker
                                value={checkOut}
                                onChange={(newValue) => setCheckOut(newValue)}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: datePickerTextFieldProps('Check out')
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="h6" gutterBottom>Guests</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                <Typography>Number of guests</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setGuests(prev => Math.max(0, parseInt(prev || '0') - 1).toString())}
                                        disabled={!guests || parseInt(guests) === 0}
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
                                            {!guests || parseInt(guests) === 0 ? 'Any' : guests}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => setGuests(prev => (parseInt(prev || '0') + 1).toString())}
                                        sx={{ border: 1, borderColor: 'grey.300' }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 3,
                        justifyContent: 'space-between'
                    }}
                >
                    <Button
                        variant="text"
                        onClick={handleClear}
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
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 4,
                            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #7b1fa2 90%)',
                            }
                        }}
                    >
                        Search
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default MobileSearchModal;