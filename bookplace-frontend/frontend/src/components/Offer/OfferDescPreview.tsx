import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import Divider from "@mui/material/Divider";
import { useOffer } from "./OfferContext.tsx";
import OfferDescModal from "./OfferDescModal";

const OfferDescPreview: React.FC = () => {
    const { offer } = useOffer();
    const displayDescription = offer?.description || "";
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [displayDescription]);

    return (
        <Box>
            <Divider
                sx={{
                    my: 3,
                    borderColor: colors.grey[300],
                }}
            />

            <Typography
                ref={textRef}
                sx={{
                    whiteSpace: 'pre-line',
                    display: '-webkit-box',
                    WebkitLineClamp: 15,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {displayDescription}
            </Typography>

            {isOverflowing && (
                <Button
                    onClick={handleOpenModal}
                    sx={{
                        padding: "9px 16px",
                        boxSizing: 'border-box',
                        borderRadius: 2,
                        border: `1px solid ${colors.black[900]}`,
                        color: colors.black[900],
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "0.9rem",
                        mt: 2
                    }}
                >

                    Show more
                </Button>
            )}

            <OfferDescModal
                open={isModalOpen}
                onClose={handleCloseModal}
                description={displayDescription}
            />
        </Box>
    );
};

export default OfferDescPreview;
