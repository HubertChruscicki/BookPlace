import React, { useMemo, useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Divider,
    IconButton,
    CircularProgress,
    Avatar,
    Rating,
    ImageList,
    ImageListItem,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import dayjs from 'dayjs';
import { useOfferReviews } from '../../../hooks/useReviews';
import type { GetOfferReviewsParams } from '../../../models/ReviewModels';
import type { OfferReview } from '../../../models/ReviewModels';

interface OfferReviewsModalProps {
    open: boolean;
    onClose: () => void;
    offerId: number;
}

const DEFAULT_PARAMS: GetOfferReviewsParams = {
    OrderBy: 'CreatedAt',
    OrderDescending: true,
    PageNumber: 1,
    PageSize: 20,
};

const OfferReviewsModal: React.FC<OfferReviewsModalProps> = ({ open, onClose, offerId }) => {
    const [queryParams, setQueryParams] = useState<GetOfferReviewsParams>(DEFAULT_PARAMS);

    const { data, isLoading, isError } = useOfferReviews(offerId, queryParams, { enabled: open });

    const reviews = useMemo(() => data?.items ?? [], [data]);

    const handleOrderByChange = (event: { target: { value: unknown } }) => {
        const value = event.target.value as 'CreatedAt' | 'Rating';
        setQueryParams((prev) => ({ ...prev, OrderBy: value }));
    };

    const handleOrderDirectionChange = (_event: React.MouseEvent<HTMLElement>, value: 'asc' | 'desc' | null) => {
        if (!value) return;
        setQueryParams((prev) => ({ ...prev, OrderDescending: value === 'desc' }));
    };

    const renderReview = (review: OfferReview) => {
        const createdAt = dayjs(review.createdAt).format('DD MMM YYYY');
        const photos = review.photos.slice(0, 3);

        return (
            <Box key={review.id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={review.guestProfilePictureUrl} alt={review.guestName} sx={{ width: 48, height: 48 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>{review.guestName}</Typography>
                            <Typography variant="body2" color="text.secondary">Stayed on {createdAt}</Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Open chat about this review">
                        <IconButton color="primary" onClick={() => window.location.assign(`/chat`)}>
                            <ChatBubbleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Rating value={review.rating} precision={0.5} readOnly sx={{ color: '#faaf00', mb: 1 }} />
                <Typography variant="body1" sx={{ mb: photos.length ? 2 : 0, lineHeight: 1.6 }}>
                    {review.content}
                </Typography>
                {photos.length > 0 && (
                    <ImageList cols={Math.min(photos.length, 3)} gap={8} sx={{ mb: 1 }}>
                        {photos.map((photo) => (
                            <ImageListItem key={photo.id}>
                                <Box
                                    component="img"
                                    src={photo.thumbnailUrl || photo.originalUrl}
                                    alt={`Review photo ${photo.id}`}
                                    sx={{ width: '100%', height: '100%', borderRadius: 2, objectFit: 'cover' }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">All reviews</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="reviews-order-by">Sort by</InputLabel>
                        <Select
                            labelId="reviews-order-by"
                            label="Sort by"
                            value={queryParams.OrderBy}
                            onChange={handleOrderByChange}
                        >
                            <MenuItem value="CreatedAt">Date</MenuItem>
                            <MenuItem value="Rating">Rating</MenuItem>
                        </Select>
                    </FormControl>
                    <ToggleButtonGroup
                        exclusive
                        value={queryParams.OrderDescending ? 'desc' : 'asc'}
                        onChange={handleOrderDirectionChange}
                        size="small"
                    >
                        <ToggleButton value="asc">Ascending</ToggleButton>
                        <ToggleButton value="desc">Descending</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {isError && (
                    <Typography color="error">Unable to load reviews. Please try again later.</Typography>
                )}

                {!isLoading && !isError && reviews.length === 0 && (
                    <Typography>No reviews yet.</Typography>
                )}

                {!isLoading && !isError && reviews.map(renderReview)}
            </DialogContent>
        </Dialog>
    );
};

export default OfferReviewsModal;

