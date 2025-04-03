import React from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {ReviewModel} from "../../models/ReviewModel.ts";
import FormContainer from "../Common/FormContainer.tsx";
import {Box, Button, Rating, TextField, Typography} from "@mui/material";

export interface ReviewFormProps {
    onSubmit: (offer: ReviewModel) => Promise<void>;
}

const AddReviewForm: React.FC<ReviewFormProps> = ({onSubmit}) => {

    const DESC_MAX_LENGTH = 1000;

    const {register, handleSubmit, watch, control, formState: {errors}} = useForm<ReviewModel>({
        defaultValues: {
            rating: 2,
            comment: ""
        }
    });

    const onSubmitHandler: SubmitHandler<ReviewModel> = async (data) => {
        try {
            await onSubmit({ ...data });
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    return(
        <FormContainer
            title="Share your opinion about the place"
            onSubmit={handleSubmit(onSubmitHandler)}
        >
            <Box sx={{ mb: 2}}>
                <Controller
                    name="rating"
                    control={control}
                    render={({field}) => (
                        <Rating
                            {...field}
                            size="large"
                            onChange={(_, value)=> {
                                field.onChange(value)
                            }}
                        />
                    )}
                />
            </Box>

            <TextField
                {...register("comment", {
                    required: "Comment is required",
                    maxLength: {
                        value: DESC_MAX_LENGTH,
                        message: "Comment is too long"
                    }
                })}
                label="Comment"
                fullWidth
                multiline
                minRows={6}
                maxRows={10}
                error={!!errors.comment}
            />
            <Box
                sx={{display: "flex", width: "100%", justifyContent: "space-between", marginBottom: 4}}>
                <Typography variant="caption" color="error">
                    {errors.comment?.type === "required" && "Comment is required"}
                    {errors.comment?.type === "maxLength" && "Comment is too long"}
                </Typography>
                <Typography
                    variant="caption"
                    color={watch("comment")?.length > DESC_MAX_LENGTH ? "error" : "textSecondary"}
                >
                    {watch("comment")?.length || 0}/{DESC_MAX_LENGTH} characters
                </Typography>
            </Box>

            <Button variant="contained" color="primary" type="submit" fullWidth
                    sx={{marginTop: 2, textTransform: 'none'}}>
                Add review
            </Button>

        </FormContainer>
    )

};

export default AddReviewForm;


