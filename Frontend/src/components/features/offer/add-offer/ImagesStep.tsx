import React, { useCallback, useState } from 'react';
import { Box, Typography, IconButton, Grid, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useAddOfferForm } from './AddOfferFormContext';
import type { CreateOfferPhotoPayload } from '../../../../models/OfferModels';

interface PhotoPreview {
    base64Data: string;
    isCover: boolean;
    previewUrl: string;
    fileName: string;
}

const MAX_PHOTOS = 6;

const ImagesStep: React.FC = () => {
    const { watch, setValue, formState: { errors } } = useAddOfferForm();
    const photos = watch('photos') as CreateOfferPhotoPayload[];
    
    const [previews, setPreviews] = useState<PhotoPreview[]>(() => {
        // Initialize previews from existing photos
        return photos.map((photo, index) => ({
            ...photo,
            previewUrl: photo.base64Data.startsWith('data:') 
                ? photo.base64Data 
                : `data:image/jpeg;base64,${photo.base64Data}`,
            fileName: `Photo ${index + 1}`,
        }));
    });
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileSelect = useCallback(async (files: FileList | null) => {
        if (!files) return;

        const remainingSlots = MAX_PHOTOS - previews.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        const newPreviews: PhotoPreview[] = [];

        for (const file of filesToProcess) {
            if (!file.type.startsWith('image/')) continue;

            try {
                const base64 = await convertToBase64(file);
                newPreviews.push({
                    base64Data: base64,
                    isCover: previews.length === 0 && newPreviews.length === 0, // First photo is cover
                    previewUrl: base64,
                    fileName: file.name,
                });
            } catch (error) {
                console.error('Failed to convert image:', error);
            }
        }

        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        
        // Update form state
        setValue('photos', updatedPreviews.map(p => ({
            base64Data: p.base64Data,
            isCover: p.isCover,
        })), { shouldValidate: true });
    }, [previews, setValue]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    }, [handleFileSelect]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDelete = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        
        // If deleted photo was cover, make first remaining photo the cover
        if (previews[index].isCover && updatedPreviews.length > 0) {
            updatedPreviews[0].isCover = true;
        }
        
        setPreviews(updatedPreviews);
        setValue('photos', updatedPreviews.map(p => ({
            base64Data: p.base64Data,
            isCover: p.isCover,
        })), { shouldValidate: true });
    };

    const handleSetCover = (index: number) => {
        const updatedPreviews = previews.map((p, i) => ({
            ...p,
            isCover: i === index,
        }));
        
        setPreviews(updatedPreviews);
        setValue('photos', updatedPreviews.map(p => ({
            base64Data: p.base64Data,
            isCover: p.isCover,
        })), { shouldValidate: true });
    };

    // Drag and drop reordering
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOverItem = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updatedPreviews = [...previews];
        const [draggedItem] = updatedPreviews.splice(draggedIndex, 1);
        updatedPreviews.splice(index, 0, draggedItem);

        setPreviews(updatedPreviews);
        setDraggedIndex(index);
        
        setValue('photos', updatedPreviews.map(p => ({
            base64Data: p.base64Data,
            isCover: p.isCover,
        })), { shouldValidate: true });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Photos
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Add up to {MAX_PHOTOS} photos of your place. Drag to reorder.
            </Typography>

            {/* Dropzone */}
            {previews.length < MAX_PHOTOS && (
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: 'background.paper',
                        mb: 3,
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                        },
                    }}
                    onClick={() => document.getElementById('photo-input')?.click()}
                >
                    <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Drop images here or click to upload
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        PNG, JPG up to 10MB each ({MAX_PHOTOS - previews.length} slots remaining)
                    </Typography>
                </Box>
            )}

            {/* Photo Grid */}
            {previews.length > 0 && (
                <Grid container spacing={2}>
                    {previews.map((preview, index) => (
                        <Grid size={{ xs: 6, sm: 4, md: 4 }} key={index}>
                            <Box
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOverItem(e, index)}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    aspectRatio: '4/3',
                                    border: preview.isCover ? '3px solid' : '1px solid',
                                    borderColor: preview.isCover ? 'primary.main' : 'divider',
                                    opacity: draggedIndex === index ? 0.5 : 1,
                                    cursor: 'grab',
                                    '&:active': {
                                        cursor: 'grabbing',
                                    },
                                }}
                            >
                                <img
                                    src={preview.previewUrl}
                                    alt={preview.fileName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                
                                {/* Drag handle */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        borderRadius: 1,
                                        p: 0.5,
                                    }}
                                >
                                    <DragIndicatorIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>

                                {/* Cover badge */}
                                {preview.isCover && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        COVER
                                    </Box>
                                )}

                                {/* Action buttons */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        display: 'flex',
                                        gap: 0.5,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => handleSetCover(index)}
                                        sx={{
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                        }}
                                    >
                                        {preview.isCover ? (
                                            <StarIcon sx={{ fontSize: 18 }} />
                                        ) : (
                                            <StarBorderIcon sx={{ fontSize: 18 }} />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(index)}
                                        sx={{
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'error.main' },
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {errors.photos && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Please add at least one photo
                </Alert>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
                💡 Tip: Click the star icon to set a photo as cover. Drag photos to reorder.
            </Typography>
        </Box>
    );
};

export default ImagesStep;
