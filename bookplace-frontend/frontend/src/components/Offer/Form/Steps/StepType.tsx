import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Autocomplete, Box, TextField} from "@mui/material";
import FormContainer from "../../../Common/FormContainer.tsx";
import api from "../../../../api/axiosApi.ts";


interface Option {
    value: number;
    label: string;
}

const StepType: React.FC = () => {

    const {register, watch, getValues, setValue, formState: {errors}} = useFormContext();
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

                <Autocomplete
                    options={options}
                    value={options.find((o) => o.value === watch("offer_main_type")) || null}
                    onChange={(_, newValue) => {
                        setValue("offer_main_type", newValue?.value || null, { shouldValidate: true });
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

                <input type="hidden" {...register("offer_types", {required: "Main offer type is required"})} />

                <Autocomplete
                    multiple
                    options={options}
                    filterSelectedOptions
                    value={options.filter((o) =>
                        (watch("offer_types") || []).includes(o.value)
                    )}
                    onChange={(_, newValue) => {
                        const ids = newValue.map((option) => option.value);
                        setValue("offer_types", ids);
                    }}
                    getOptionLabel={(option) => option?.label || ""}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Offer other types"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />



            </FormContainer>
        </Box>
    );
};

export default StepType;
