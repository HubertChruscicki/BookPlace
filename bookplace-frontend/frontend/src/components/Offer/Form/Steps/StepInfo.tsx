import React from "react";
import {useFormContext} from "react-hook-form";
import {Box, TextField, Typography} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";

const StepInfo: React.FC = () => {
    const {register, getValues, watch, formState: {errors}} = useFormContext();

    const DESC_MAX_LENGTH = 1500;

    return (
        <Box>
            <FormContainer
                title="Fill basic informations"
            >
                <TextField
                    {...register("title", {required: "Title is required"})}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />

                <TextField
                    {...register("description", {
                        required: "Description is required",
                        maxLength: {
                            value: DESC_MAX_LENGTH,
                            message: "Description is too long"
                        }
                    })}
                    label="Description"
                    fullWidth
                    multiline
                    minRows={6}
                    maxRows={10}
                    error={!!errors.description}
                />

                <Box
                    sx={{display: "flex", width: "100%", justifyContent: "space-between", marginBottom: 4}}>
                    <Typography variant="caption" color="error">
                        {errors.description?.type === "required" && "Description is required"}
                        {errors.description?.type === "maxLength" && "Description is too long"}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={watch("description")?.length > DESC_MAX_LENGTH ? "error" : "textSecondary"}
                    >
                        {watch("description")?.length || 0}/{DESC_MAX_LENGTH} characters
                    </Typography>
                </Box>


                <TextField
                    {...register("price_per_night", {required: "Price is required",
                        validate: () => {
                            const { price_per_night } = getValues();
                            return  Number(price_per_night) > 0 || "Price cannot be 0";
                        }
                    })}
                    label="Price per night"
                    fullWidth
                    type="number"
                    error={!!errors.price_per_night}
                    helperText={errors.price_per_night?.message}
                    InputProps={{
                        inputProps: {
                            min: 0
                        },
                    }}
                />

                <TextField
                    {...register("max_guests", {required: "Guests limit is required",
                        validate: () => {
                            const { max_guests } = getValues();
                            return  Number(max_guests) > 0 || "At least 1 guest must be specified";
                        }
                    })}
                    label="Max number of guests"
                    fullWidth
                    type="number"
                    error={!!errors.max_guests}
                    helperText={errors.max_guests?.message}
                    InputProps={{
                        inputProps: {
                            min: 1
                        },
                    }}
                />

            </FormContainer>

        </Box>
    );
}

export default StepInfo;



