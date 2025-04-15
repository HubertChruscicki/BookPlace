import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Autocomplete, Box, TextField} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";
import api from "../../../../api/axiosApi.ts";

const StepDetails: React.FC = () => {

    const {register, getValues, formState: {errors}} = useFormContext();
    const [options, setOptions] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const validateBedsSum = () => {
        const { beds, double_beds, sofa_beds } = getValues().details;
        const bedsSum = (Number(beds) || 0) + (Number(double_beds) || 0) + (Number(sofa_beds) || 0);
        return bedsSum > 0 || "At least one bed in whole object must be specified";
    };

    useEffect(() => {
        api.get("/offer-details/amenities-keys/")
            .then(res => {
                setOptions(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("Error during loading offer data:", err)
                setError("Cannot find offer");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    return (
        <Box>
            <FormContainer title="Fill the details">

                <Autocomplete //TODO WALIDACJA PLUS WPISANIE DO FORMA
                    multiple
                    options={options}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Offer amenities"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

                <TextField
                    {...register("details.rooms", {required: "Number of rooms is required",
                        validate: () => {
                            const { rooms } = getValues().details;
                            return  Number(rooms) > 0 || "At least one room must be specified";
                        }
                    })}
                    label="Number of rooms"
                    fullWidth
                    type="number"
                    error={!!errors.details?.rooms}
                    helperText={errors.details?.rooms?.message}
                    InputProps={{
                        inputProps: {
                            min: 1
                        },
                    }}
                />

                <TextField
                    {...register("details.beds", {
                        required: "Number of single beds is required",
                        validate: validateBedsSum
                    })}
                    label="Number of single beds"
                    fullWidth
                    type="number"
                    error={!!errors.details?.beds}
                    helperText={errors.details?.beds?.message}
                    InputProps={{
                        inputProps: {
                            min: 0
                        },
                    }}
                />

                <TextField
                    {...register("details.double_beds", {
                        required: "Number of double beds is required",
                        validate: validateBedsSum
                    })}
                    label="Number of double beds"
                    fullWidth
                    type="number"
                    error={!!errors.details?.double_beds}
                    helperText={errors.details?.double_beds?.message}
                    InputProps={{
                        inputProps: {
                            min: 0
                        },
                    }}
                />

                <TextField
                    {...register("details.sofa_beds", {
                        required: "Number of sofas is required",
                        validate: validateBedsSum
                    })}
                    label="Number of sofas"
                    fullWidth
                    type="number"
                    error={!!errors.details?.sofa_beds}
                    helperText={errors.details?.sofa_beds?.message}
                    InputProps={{
                        inputProps: {
                            min: 0
                        },
                    }}
                />

            </FormContainer>
        </Box>
    );
};

export default StepDetails;
