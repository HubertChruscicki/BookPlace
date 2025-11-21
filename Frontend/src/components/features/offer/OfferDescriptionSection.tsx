import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface OfferDescriptionSectionProps {
    description: string;
}

const MAX_VISIBLE_LENGTH = 500;

const OfferDescriptionModal: React.FC<{ open: boolean, onClose: () => void, fullText: string }> = ({ open, onClose, fullText }) => {
    return (
        <Modal open={open} onClose={onClose} aria-labelledby="description-modal-title">
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
                    <Typography id="description-modal-title" variant="h5" component="h2" fontWeight="bold">
                        Full Description
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ overflowY: 'auto', pr: 2 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {fullText}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

const OfferDescriptionSection: React.FC<OfferDescriptionSectionProps> = ({ description }) => {
   
    const [modalOpen, setModalOpen] = useState(false);
   
    const needsTruncation = description.length > MAX_VISIBLE_LENGTH;

    const previewText = useMemo(() => {
        if (!needsTruncation) {
            return description;
        }
        const truncated = description.substring(0, MAX_VISIBLE_LENGTH);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
    }, [description, needsTruncation]);

    return (
        <Box sx={{ py: 4 }}>
            <Typography
                variant="body1"
                sx={{
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    fontSize: '1.1rem',
                    mb: needsTruncation ? 2 : 0
                }}
            >
                {previewText}
            </Typography>

            {needsTruncation && (
                <Button
                    variant="outlined"
                    onClick={() => setModalOpen(true)}
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: 'text.primary',
                        py: 1,
                        px: 3,
                        fontWeight: 600,
                        minWidth: 200,
                    }}
                >
                    Read More
                </Button>
            )}

            <OfferDescriptionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                fullText={description}
            />
        </Box>
    );
};

export default OfferDescriptionSection;