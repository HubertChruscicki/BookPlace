import React from 'react';
import { Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { colors } from "../../theme/colors.ts";

interface OfferDescriptionModalProps {
    open: boolean;
    onClose: () => void;
    description: string;
}

const OfferDescModal: React.FC<OfferDescriptionModalProps> = ({ open, onClose, description }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="offer-desc-modal-title"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 1200,
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
                    <Typography
                        id="offer-desc-modal-title"
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                    >
                        Information about the place
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        maxHeight: 'calc(80vh - 150px)',
                        overflowY: 'auto',
                        p: 1
                    }}
                >
                    <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: colors.black[900] }}>
                        {description}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default OfferDescModal;
