import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Rating,
} from '@mui/material';
import {LocationOn, People, Hotel, Bathtub} from '@mui/icons-material';
import type {OfferSummary} from '../../models/OfferModels';
import {theme} from "../../theme.ts";
import {useNavigate} from "react-router-dom";

interface OfferCardProps {
    offer: OfferSummary;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    //TODO REVIEW PROPS
}

export const OfferCard: React.FC<OfferCardProps> = ({offer, checkInDate, checkOutDate, guests}) => {

    const navigate = useNavigate();
    const handleBookNow = () => {
        const queryParams = new URLSearchParams();

        if (checkInDate) {
            queryParams.set('CheckInDate', checkInDate);
        }
        if (checkOutDate) {
            queryParams.set('CheckOutDate', checkOutDate);
        }
        if (guests !== undefined) {
            queryParams.set('Guests', guests.toString());
        }

        const queryString = queryParams.toString();

        if (queryString) {
            navigate(`/offer/${offer.id}?${queryString}`);
        } else {
            navigate(`/offer/${offer.id}`);
        }
    };


    const getImageUrl = () => {
        if (offer.coverPhoto?.thumbnailUrl) {
            return `http://localhost:8080/${offer.coverPhoto.thumbnailUrl}`;
        }
        if (offer.coverPhoto?.mediumUrl) {
            return `http://localhost:8080/${offer.coverPhoto.mediumUrl}`;
        }
        if (offer.coverPhoto?.originalUrl) {
            return `http://localhost:8080/${offer.coverPhoto.originalUrl}`;
        }
        return 'https://via.placeholder.com/400x200?text=No+Image';
    };

    const averageRating = 4.5; //TODO HARDCODED


    return (
        <Card
            sx={{
                width: '100%',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={getImageUrl()}
                alt={offer.title}
                sx={{
                    objectFit: 'cover',
                    borderRadius: '12px 12px 0 0',
                    flexShrink: 0
                }}
            />

            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.5
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <Rating
                            name="read-only"
                            value={averageRating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{color: '#faaf00'}}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {averageRating.toFixed(1)}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{
                            pointerEvents: 'none',
                            textTransform: 'none',
                            borderRadius: 25,
                            fontWeight: 700,
                            padding: '4px 12px',
                            minWidth: 'auto',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            backgroundColor: 'transparent',
                            fontSize: '0.75rem',
                            height: '28px',
                        }}
                    >
                        {offer.offerType.name}
                    </Button>
                </Box>

                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1
                    }}
                >
                    {offer.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    <LocationOn sx={{fontSize: 18, color: 'primary.main'}}/>
                    {offer.addressCity}, {offer.addressCountry}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    flexWrap: 'wrap',
                    py: 1,
                    borderTop: '1px solid #eee',
                    borderBottom: '1px solid #eee'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <People sx={{fontSize: 18, color: 'text.secondary'}}/>
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 500}}>
                            {offer.maxGuests} Guests
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <Hotel sx={{fontSize: 18, color: 'text.secondary'}}/>
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 500}}>
                            {offer.rooms} Rooms
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                        <Bathtub sx={{fontSize: 18, color: 'text.secondary'}}/>
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 500}}>
                            {offer.bathrooms} Baths
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',

                        pt: 1
                    }}
                >
                    <Box>
                        <Typography variant="h5" component="span"
                                    sx={{fontWeight: 700, color: theme.palette.primary.dark}}>
                            ${offer.pricePerNight.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ml: 0.5}}>
                            / night
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={handleBookNow}
                        sx={{
                            borderRadius: 25,
                            px: 3,
                            fontWeight: 700
                        }}
                    >
                        Book Now
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OfferCard;