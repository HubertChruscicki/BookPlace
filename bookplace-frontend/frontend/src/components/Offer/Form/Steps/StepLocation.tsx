import React from "react";
import {useFormContext} from "react-hook-form";
import {Box, TextField} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";

const StepLocation: React.FC = () => {
    const {register, formState: {errors}} = useFormContext();

    return (
        <Box>
            <FormContainer
                title="Where is your place?"
            >
                <TextField
                    {...register("location.address", {required: "Address is required"})}
                    label="Address"
                    fullWidth
                    error={!!errors.location?.address}
                    helperText={errors.location?.address?.message}
                />
                <TextField
                    {...register("location.city", {required: "City is required"})}
                    label="City"
                    fullWidth
                    error={!!errors.location?.city}
                    helperText={errors.location?.city?.message}
                />


                <TextField
                    {...register("location.province", {required: "Province is required"})}
                    label="Province"
                    fullWidth
                    error={!!errors.location?.province}
                    helperText={errors.location?.province?.message}
                />


                <TextField
                    {...register("location.country", {required: "Country is required"})}
                    label="Country"
                    fullWidth
                    error={!!errors.location?.country}
                    helperText={errors.location?.country?.message}
                />



            </FormContainer>

        </Box>

    );
}

export default StepLocation;
