import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
} from '@mui/material';
import {
    Add,
    Home,
    Star,
    BookOnline,
    Edit,
    Visibility,
} from '@mui/icons-material';
import type { HostOffer } from '../../models/HostModels.ts';

export default function HostOffersPage() {
    const mockOffers: HostOffer[] = [
        {
            id: '1',
            title: 'Przytulny apartament w centrum Krakowa',
            location: 'Kraków, Stare Miasto',
            pricePerNight: 250,
            thumbnailUrl: '',
            isActive: true,
            totalBookings: 23,
            averageRating: 4.8,
            lastBookingDate: '2023-12-15',
            createdAt: '2023-06-01',
        },
        {
            id: '2',
            title: 'Dom wakacyjny nad morzem',
            location: 'Gdańsk, Sopot',
            pricePerNight: 450,
            thumbnailUrl: '',
            isActive: true,
            totalBookings: 15,
            averageRating: 4.6,
            lastBookingDate: '2023-12-10',
            createdAt: '2023-07-15',
        },
        {
            id: '3',
            title: 'Studio w Warszawie',
            location: 'Warszawa, Śródmieście',
            pricePerNight: 180,
            thumbnailUrl: '',
            isActive: false,
            totalBookings: 8,
            averageRating: 4.2,
            lastBookingDate: '2023-11-20',
            createdAt: '2023-08-01',
        },
    ];

    const handleAddOffer = () => {
        console.log('Dodaj nową ofertę - placeholder');
    };

    const handleEditOffer = (offerId: string) => {
        console.log('Edytuj ofertę:', offerId);
    };

    const handleViewOffer = (offerId: string) => {
        console.log('Zobacz ofertę:', offerId);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1,
                        }}
                    >
                        Moje oferty
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                        }}
                    >
                        Zarządzaj swoimi ofertami noclegów
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddOffer}
                    sx={{
                        borderRadius: 25,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                    }}
                >
                    Dodaj ofertę
                </Button>
            </Box>

            <Grid container spacing={3}>
                {mockOffers.map((offer) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={offer.id}>
                        <Card
                            elevation={4}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'grey.100',
                                height: '100%',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    height: 200,
                                    bgcolor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Home sx={{ fontSize: 60, color: 'grey.400' }} />
                                <Chip
                                    label={offer.isActive ? 'Aktywna' : 'Nieaktywna'}
                                    color={offer.isActive ? 'success' : 'default'}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        fontWeight: 700,
                                        borderRadius: 20,
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.15rem',
                                        mb: 0.5,
                                        height: 48,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {offer.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    {offer.location}
                                </Typography>

                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} sx={{ mt: 'auto' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                                        {offer.pricePerNight} zł/noc
                                    </Typography>

                                    {offer.averageRating > 0 && (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Star sx={{ fontSize: 16, color: 'gold' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                {offer.averageRating}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                        <BookOnline sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            {offer.totalBookings} rezerwacji
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Box display="flex" gap={1}>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<Visibility />}
                                        onClick={() => handleViewOffer(offer.id)}
                                        sx={{
                                            borderRadius: 25, 
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            flex: 1,
                                        }}
                                    >
                                        Zobacz
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        startIcon={<Edit />}
                                        onClick={() => handleEditOffer(offer.id)}
                                        sx={{
                                            borderRadius: 25, 
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            flex: 1,
                                        }}
                                    >
                                        Edytuj
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {mockOffers.length === 0 && (
                <Card
                    elevation={4}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.100',
                        minHeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                        <Home sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
                            Brak ofert
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Rozpocznij zarabianie na swoich nieruchomościach
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddOffer}
                            sx={{ borderRadius: 25, textTransform: 'none', fontWeight: 700 }}
                        >
                            Dodaj pierwszą ofertę
                        </Button>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}