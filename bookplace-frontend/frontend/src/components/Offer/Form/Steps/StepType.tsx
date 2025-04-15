import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Autocomplete, Box, TextField} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";
import api from "../../../../api/axiosApi.ts";
import { Controller } from "react-hook-form";


interface Option {
    value: number;
    label: string;
}

const StepType: React.FC = () => {

    const {register, watch, control, getValues, setValue, formState: {errors}} = useFormContext();
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        api.get("/offer-type/")
            .then(res => {
                const mapped = res.data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                }));
                setOptions(mapped);
                setError(null);
            })
            .catch(err => {
                console.error("Error during loading offer types:", err)
                setError("Cannot find offer types");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    return (
        <Box>
            <FormContainer title="Describe your place">

                <Controller
                    name="offer_main_type"
                    control={control}
                    rules={{ required: "Main offer type is required" }}
                    render={({ field }) => (
                        <Autocomplete
                            options={options}
                            value={options.find((o) => o.value === field.value) || null}
                            onChange={(_, newValue) => {
                                field.onChange(newValue?.value || null);
                            }}
                            getOptionLabel={(option) => option?.label || ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Offer main type"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.offer_main_type}
                                    helperText={errors.offer_main_type?.message}
                                />
                            )}
                        />
                    )}
                />


                <Controller
                    name="offer_type"
                    control={control}
                    rules={{ required: "At least one other type is required" }}
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            options={options}
                            value={options.filter((o) =>
                                (watch("offer_type") || []).includes(o.value)
                            )}
                            onChange={(_, newValue) => {
                                const ids = newValue.map((option) => option.value);
                                setValue("offer_type", ids, {shouldValidate: true});
                            }}
                            getOptionLabel={(option) => option?.label || ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Offer other type"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.offer_type}
                                    helperText={errors.offer_type?.message}
                                />
                            )}
                        />
                    )}
                />

            </FormContainer>
        </Box>
    );
};

export default StepType;
