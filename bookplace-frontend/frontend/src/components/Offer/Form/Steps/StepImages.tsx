import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Box, IconButton, ImageList, ImageListItem, ImageListItemBar, TextField, Typography} from "@mui/material";
import ImagesDropzone from "../ImagesDropzone.tsx";
import FormContainer from "../../../Common/FormContainer.tsx";
import DeleteIcon from "@mui/icons-material/Delete";


const MAX_FILES = 10;

const StepImages: React.FC = () => {
    const {register, setValue, watch, formState: {errors}} = useFormContext();
    const images = watch("images") || [];

    const handleFilesChange = (files: File[]) => {
        const total = [...images, ...files].slice(0, MAX_FILES);
        setValue("images", total, { shouldValidate: true });
    };

    const handleRemove = (indexToRemove: number) => {
        const updated = images.filter((_: File, idx: number) => idx !== indexToRemove);
        setValue("images", updated, { shouldValidate: true });
    };

    useEffect(() => {
        register("images", {
            validate: (files) =>
                files && files.length > 0 || "At least one image is required"
        });
    }, [register]);

    return (
    <Box>
        <FormContainer
            title="How your place look like?"
        >

            {images.length !== 0 && <Typography variant="body2" color="textSecondary" sx={{mt: 2, mb: 1}}>
                {images.length}/{MAX_FILES} images uploaded
            </Typography>}

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflow: "hidden",
                    overflowX: "auto",
                    py: 1,
                    mb: 2,
                    width: "50vw",
                }}
            >
                {images.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file);
                    return (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                minWidth: 200,
                                height: 200,
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={`img-${index}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: 8
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => handleRemove(index)}
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,0,0,0.7)"
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    );
                })}
            </Box>

            <ImagesDropzone onFilesChange={handleFilesChange} maxFiles={MAX_FILES} />

        </FormContainer>
    </Box>
    );
}

export default StepImages;
