import React, {useState} from 'react';
import {Button, Box, TextField, Typography, IconButton} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import FormStack from '../Common/FormStack.tsx';
import api from "../../api/axiosApi.ts";
import {useAuth} from "../../Auth/useAuth.ts";
import {RegisterUserModel} from "../../models/AuthModels.ts";
import {colors} from "../../theme/colors.ts";
import CloseIcon from "@mui/icons-material/Close";


interface RegisterFormProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}


const RegisterForm: React.FC<RegisterFormProps> = ({onClose, onSwitchToLogin}) => {

    const { setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleRegister = async (credentials: RegisterUserModel) => {
        try {
            const response = await api.post("/auth/register/", credentials);
            const { access, refresh, user } = response.data;

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            setAuth({ token: access, user });
            onClose();
        } catch (error: any) {
            console.error("Register error:", error);
            setErrorMessage(String(Object.values(error.response.data)[0]));
        }
    }

    const onSubmit: SubmitHandler<RegisterUserModel> = async (data) => {
        try {
            await handleRegister(data);
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Auth failed. Please try again.");
        }
    };

    const defaultRegisterValues = {
        "first_name": "",
        "last_name": "",
        email: "",
        phone: "",
        password: "",
        confirm_password: ""
    };

    const {register, handleSubmit, watch, formState: {errors}} = useForm<RegisterUserModel>({
        defaultValues: defaultRegisterValues
    });

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: "100%",
                '& .MuiFormControl-root': {
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        width: "100%",
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.blue[300],
                        }
                    }
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{display: "flex", ml: "auto"}}
            >
                <CloseIcon fontSize="medium"/>
            </IconButton>
            <FormStack>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: colors.black[900],
                        letterSpacing: '-0.5px',
                        fontSize: '2.5rem',
                        lineHeight: 1.2,
                        padding: "30px 0",
                        whiteSpace: "pre-line",
                        textAlign: "center"
                    }}
                >
                    {"Sing yourself!"}
                </Typography>

                <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{
                        visibility: errorMessage ? 'visible' : 'hidden',
                        minHeight: '1em',
                        pb: 5
                    }}
                >
                    {errorMessage || ' '}
                </Typography>

                <TextField
                    label={"First Name"}
                    value={watch("first_name") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.first_name}
                    helperText={errors.first_name ? "Please enter first name" : ""}
                    {...register("first_name", {required: true})}
                />

                <TextField
                    label={"Last Name"}
                    value={watch("last_name") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name ? "Please enter last name" : ""}
                    {...register("last_name", {required: true})}
                />

                <TextField
                    label={"Phone"}
                    value={watch("phone") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone ? "Please enter phone number" : ""}
                    {...register("phone", {required: true})}
                />

                <TextField
                    label={"Email"}
                    value={watch("email") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email ? "Please enter email address" : ""}
                    {...register("email", {required: true})}
                />

                <TextField
                    label={"Password"}
                    type="password"
                    value={watch("password") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password ? "Please enter password" : ""}
                    {...register("password", {required: true})}
                />

                <TextField
                    label={"Confirm Password"}
                    type="confirm_password"
                    value={watch("confirm_password") || ""}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password ? "Please fill confirm password field" : ""}
                    {...register("confirm_password", {required: true})}
                />

            </FormStack>

            <Button variant="contained" color="primary" type="submit" fullWidth
                    sx={{marginTop: 1, textTransform: 'none'}} >
                {"Register"}
            </Button>
            <Button
                variant="text"
                fullWidth
                onClick={onSwitchToLogin}
                sx={{ mt: 1, textTransform: 'none' }}
            >
                Already have account?
            </Button>
        </Box>

    );
};

export default RegisterForm;


