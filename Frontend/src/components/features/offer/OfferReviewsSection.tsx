import React, { useMemo, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Rating,
    Typography,
    CircularProgress,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import dayjs from 'dayjs';
import { useOfferReviews } from '../../../hooks/useReviews';
import OfferReviewsModal from './OfferReviewsModal';
import type { OfferDetail } from '../../../models/OfferModels';

interface OfferReviewsSectionProps {
    offer: OfferDetail;
}

const INITIAL_PARAMS = {
    OrderBy: 'CreatedAt' as const,
    OrderDescending: true,
    PageNumber: 1,
    PageSize: 3,
};

const OfferReviewsSection: React.FC<OfferReviewsSectionProps> = ({ offer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading, isError } = useOfferReviews(offer.id, INITIAL_PARAMS);

    const reviews = useMemo(() => data?.items ?? [], [data]);

    const handleOpenChat = (reviewId?: number) => {
        const url = reviewId ? `/chat?reviewId=${reviewId}` : `/chat?offerId=${offer.id}`;
        window.location.assign(url);
    };

    return (
        <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Reviews ({offer.reviewsCount ?? reviews.length})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating value={offer.rating ?? 0} precision={0.1} readOnly sx={{ color: '#faaf00' }} />
                        <Typography variant="body1" color="text.secondary">
                            {offer.rating ? `${offer.rating.toFixed(1)} •` : ''} {offer.reviewsCount ?? 0} reviews
                        </Typography>
                    </Box>
                </Box>
                <IconButton color="primary" onClick={() => handleOpenChat()}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {isError && (
                <Typography color="error">Unable to load reviews right now.</Typography>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
                <Typography color="text.secondary">No reviews yet.</Typography>
            )}

            {!isLoading && !isError && (
                <Grid container spacing={3}>
                    {reviews.map((review) => (
                        <Grid key={review.id} size={{ xs: 12 }}>
                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Avatar src={review.guestProfilePictureUrl} alt={review.guestName} />
                                        <Box>
                                            <Typography fontWeight={600}>{review.guestName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {dayjs(review.createdAt).format('DD MMM YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton size="small" onClick={() => handleOpenChat(review.id)}>
                                        <ChatBubbleOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ color: '#faaf00', mb: 1 }} />
                                <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                                    {review.content}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ borderRadius: 2 }}>
                    View more
                </Button>
                <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ borderRadius: 2 }}>
                    Write a review
                </Button>
            </Box>

            <OfferReviewsModal open={isModalOpen} onClose={() => setIsModalOpen(false)} offerId={offer.id} />
        </Box>
    );
};

export default OfferReviewsSection;

