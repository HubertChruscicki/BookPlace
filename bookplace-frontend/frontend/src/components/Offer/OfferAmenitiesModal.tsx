import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AmenityItem from "./Form/AmenityItem.tsx";
import amenityIcons from "./AmenityIcons.tsx";

interface AmenitiesModalProps {
    open: boolean;
    onClose: () => void;
    amenities: { key: string; name: string }[];
}

const OfferAmenitiesModal: React.FC<AmenitiesModalProps> = ({ open, onClose, amenities }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="amenities-modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 600,
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 4,
                    p: 4,
                    outline: 'none',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}
                >
                    <Typography id="amenities-modal-title" variant="h5" component="h2" fontWeight="bold">
                        All amenities
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        maxHeight: 'calc(80vh - 150px)',
                        overflowY: 'auto',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2
                    }}
                >
                    {amenities.map(amenity => (
                        <AmenityItem
                            key={amenity.key}
                            name={amenity.name}
                            icon={amenityIcons[amenity.key]}
                        />
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default OfferAmenitiesModal;
