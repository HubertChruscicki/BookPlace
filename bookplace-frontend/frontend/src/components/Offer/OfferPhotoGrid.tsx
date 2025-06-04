import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useOffer } from "./OfferContext.tsx";

const OfferHeader: React.FC = () => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const { offer } = useOffer();

    useEffect(() => {
        if (offer?.images) {
            const paths = offer.images.map((img) => img.image.trim());
            setImageUrls(paths);
        }
    }, [offer]);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1220px",
                display: { xs: "block", md: "flex" },
                gap: { xs: 0, md: 2 },
            }}
        >
            <Box
                sx={{
                    height: { xs: 300, sm: 400, md: 500 },
                    width: { xs: "100%", md: "50%" },
                    borderRadius: { xs: "15px", md: "15px 0 0 15px" },
                    bgcolor: "grey.300",
                    backgroundImage: imageUrls[0] ? `url(${imageUrls[0]})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: { xs: "none", md: "0 4px 8px rgba(0,0,0,0.2)" },
                    mb: { xs: 2, md: 0 },
                }}
            />

            <Box
                sx={{
                    display: { xs: "none", md: "grid" },
                    width: "50%",
                    height: 500,
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",

                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        borderRadius: "0 0 0 0",
                        bgcolor: "grey.300",
                        backgroundImage: imageUrls[1]
                            ? `url(${imageUrls[1]})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                />
                <Box
                    sx={{
                        borderRadius: "0 15px 0 0",
                        bgcolor: "grey.300",
                        backgroundImage: imageUrls[2]
                            ? `url(${imageUrls[2]})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                />
                <Box
                    sx={{
                        borderRadius: "0 0 0 0",
                        bgcolor: "grey.300",
                        backgroundImage: imageUrls[3]
                            ? `url(${imageUrls[3]})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                />
                <Box
                    sx={{
                        borderRadius: "0 0 15px 0",
                        bgcolor: "grey.300",
                        backgroundImage: imageUrls[4]
                            ? `url(${imageUrls[4]})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                />
            </Box>
        </Box>
    );
};

export default OfferHeader;
