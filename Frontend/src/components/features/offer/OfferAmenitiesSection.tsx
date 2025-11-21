import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Modal, IconButton, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { Amenity } from "../../../models/OfferModels";
import { getAmenityIcon } from "../../../utils/amenityIcons";

interface OfferAmenitiesModalProps {
    open: boolean;
    onClose: () => void;
    amenities: Amenity[];
}

interface OfferAmenitiesSectionProps {
    amenities: Amenity[];
}


const OfferAmenitiesModal: React.FC<OfferAmenitiesModalProps> = ({ open, onClose, amenities }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="amenities-modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 650,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 4,
                    p: 4,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        pb: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography id="amenities-modal-title" variant="h5" component="h2" fontWeight="bold">
                        All amenities
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ overflowY: 'auto', pr: 2 }}>
                    <Stack spacing={2}>
                        {amenities.map((amenity) => {
                            const Icon = getAmenityIcon(amenity.id);
                            return (
                                <Box
                                    key={amenity.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 1.5,
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <Icon color="action" sx={{ fontSize: 24 }} />
                                    <Typography variant="body1">{amenity.name}</Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

const OfferAmenitiesSection: React.FC<OfferAmenitiesSectionProps> = ({ amenities }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const VISIBLE_COUNT = 10;

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                What this place offers
            </Typography>

            <Grid container spacing={2}>
                {amenities.slice(0, VISIBLE_COUNT).map((amenity) => {
                    const Icon = getAmenityIcon(amenity.id);
                    return (
                        <Grid size={{ xs: 12, sm: 6 }} key={amenity.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Icon sx={{ fontSize: 28, color: 'action.active' }} />
                                <Typography variant="body1">{amenity.name}</Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {amenities.length > VISIBLE_COUNT && (
                <Button
                    variant="outlined"
                    sx={{
                        mt: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: 'text.primary',
                        py: 1.5,
                        px: 3,
                        fontWeight: 600
                    }}
                    onClick={() => setModalOpen(true)}
                >
                    Show all {amenities.length} amenities
                </Button>
            )}

            <OfferAmenitiesModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                amenities={amenities}
            />
        </Box>
    );
};

export default OfferAmenitiesSection;