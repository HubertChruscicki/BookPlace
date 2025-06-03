import React, { useState } from 'react';
import { Box, Button, Typography, Divider } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import { useOffer } from "./OfferContext.tsx";
import AmenityItem from "./Form/AmenityItem.tsx";
import OfferAmenitiesModal from './OfferAmenitiesModal.tsx';
import amenityIcons from "./AmenityIcons.tsx";

const OfferAmenities: React.FC = () => {
    const { offer } = useOffer();
    const [modalOpen, setModalOpen] = useState(false);
    const MAX_VISIBLE_AMENITIES = 8;

    const availableAmenities = offer
        ? Object.entries(offer.amenities)
            .filter(([_, v]) => v === true)
            .map(([key]) => ({
                key,
                name: key
                    .split('_')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')
            }))
        : [];

    const visibleAmenities = availableAmenities.slice(0, MAX_VISIBLE_AMENITIES);
    const totalAmenities = availableAmenities.length;
    const hasMoreToShow = totalAmenities > MAX_VISIBLE_AMENITIES;

    return (
        <Box>
            <Divider sx={{ my: 3, borderColor: colors.grey[300] }} />
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 3 }}>
                What you will find in this place
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2
                }}
            >
                {visibleAmenities.map(amenity => (
                    <AmenityItem
                        key={amenity.key}
                        name={amenity.name}
                        icon={amenityIcons[amenity.key]}
                    />
                ))}
            </Box>

            {hasMoreToShow && (
                <Button
                    variant="outlined"
                    onClick={() => setModalOpen(true)}
                    sx={{
                        width: "250px",
                        padding: "13px 23px",
                        boxSizing: 'border-box',
                        borderRadius: 2,
                        border: `1px solid ${colors.black[900]}`,
                        color: colors.black[900],
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        mt: 3
                    }}
                >
                    Show all amenities ({totalAmenities})
                </Button>
            )}

            <OfferAmenitiesModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                amenities={availableAmenities}
            />
        </Box>
    );
};

export default OfferAmenities;
