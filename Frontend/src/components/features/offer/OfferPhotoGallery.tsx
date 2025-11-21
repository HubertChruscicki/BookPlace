import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton, useMediaQuery, useTheme } from "@mui/material";
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import type {OfferPhoto} from "../../../models/OfferModels";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

interface OfferPhotoGalleryProps {
    photos: OfferPhoto[];
}

const OfferPhotoGallery: React.FC<OfferPhotoGalleryProps> = ({ photos }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const sortedPhotos = [...photos].sort((a, b) => (a.isCover === b.isCover ? 0 : a.isCover ? -1 : 1));
    const mainPhoto = sortedPhotos[0];
    const sidePhotos = sortedPhotos.slice(1, 5);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
                gridTemplateRows: { xs: '350px', sm: '450px', md: '250px 250px' },                
                gap: 1,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                mt: 2,
                mb: 5
            }}>
                <Box
                    component="img"
                    src={`http://localhost:8080/${mainPhoto?.originalUrl}`}
                    alt="Main view"
                    onClick={handleOpen}
                    sx={{
                        gridColumn: { xs: '1 / -1', md: '1 / 2' },
                        gridRow: { xs: '1 / -1', md: '1 / 3' },
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 }
                    }}
                />

                {!isMobile && sidePhotos.map((photo, index) => (
                    <Box
                        key={photo.id}
                        component="img"
                        src={`http://localhost:8080/${photo.mediumUrl}`}
                        alt={`View ${index}`}
                        onClick={handleOpen}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                ))}

                <Button
                    variant="contained"
                    startIcon={<GridViewIcon />}
                    onClick={handleOpen}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        bgcolor: 'white',
                        color: 'text.primary',
                        borderRadius: 2,
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'grey.100' }
                    }}
                >
                    Show all photos
                </Button>
            </Box>

            <Dialog fullScreen open={open} onClose={handleClose}>
                <Box sx={{ position: 'relative', height: '100vh', bgcolor: 'black', display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 16, left: 16, color: 'white', zIndex: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        slidesPerView={1}
                        style={{ width: '100%', height: '80%' }}
                    >
                        {sortedPhotos.map((photo) => (
                            <SwiperSlide key={photo.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={`http://localhost:8080/${photo.originalUrl}`}
                                    alt="Gallery"
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Dialog>
        </>
    );
};

export default OfferPhotoGallery;