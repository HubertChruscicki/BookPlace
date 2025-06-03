import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Box, Checkbox, FormControlLabel, Grid} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";
import api from "../../../../api/axiosApi.ts";
import { Controller } from "react-hook-form";


interface AmenitiesOption {
    value: string;
    label: string;
}

const StepAmenities: React.FC = () => {

    const {register, watch, control, getValues, setValue, formState: {errors}} = useFormContext();
    const [options, setOptions] = useState<AmenitiesOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        api.get("/offer-amenities/")
            .then(res => {
                const mapped = res.data.map((item: any) => ({
                    value: item.key,
                    label: item.name,
                }));
                setOptions(mapped);
                setError(null);
            })
            .catch(err => {
                console.error("Error during loading offer amenities list:", err)
                setError("Cannot find offer amenities list");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    return (
        <Box>
            <FormContainer title="What you can offer the guests?">
                <Grid container spacing={2}>
                    {options.map((option) => (
                        <Grid item xs={12} sm={6} md={4} key={option.value}>
                            <Controller
                                name={`amenities.${option.value}`}
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={field.value || false}
                                                onChange={(e) => field.onChange(e.currentTarget.checked)}
                                            />
                                        }
                                        label={option.label}
                                    />
                                )}
                            />
                        </Grid>
                    ))}
                </Grid>
            </FormContainer>
        </Box>
    );
};

export default StepAmenities;
