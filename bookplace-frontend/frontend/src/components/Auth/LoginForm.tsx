import React, {useState} from 'react';
import {Button, Box, TextField, Typography, IconButton} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import FormStack from '../Common/FormStack.tsx';
import api from "../../api/axiosApi.ts";
import {useAuth} from "../../Auth/useAuth.ts";
import {LoginUserModel} from "../../models/AuthModels.ts";
import {colors} from "../../theme/colors.ts";
import CloseIcon from "@mui/icons-material/Close";


interface LoginFormProps {
    onClose: () => void;
    onSwitchToRegister: () => void;
}


const LoginForm: React.FC<LoginFormProps> = ({onClose, onSwitchToRegister}) => {

    const { setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleLogin = async (credentials: LoginUserModel) => {
        try {
            const response = await api.post("/auth/login/", credentials);
            const { access, refresh, user } = response.data;

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            setAuth({ token: access, user });
            onClose();
        } catch (error: any) {
            console.error("Login error:", error);
            setErrorMessage(String(error.message));
        }
    }

    const onSubmit: SubmitHandler<LoginUserModel> = async (data) => {
        try {
            await handleLogin(data);
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Auth failed. Please try again.");
        }
    };

    const defaultLoginValues = {
        email: "",
        password: ""
    };

    const {register, handleSubmit, watch, formState: {errors}} = useForm<LoginUserModel>({
        defaultValues: defaultLoginValues
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
                        whiteSpace: "pre-line",
                        textAlign: "center",
                        padding: '30px 0'
                    }}
                >
                    {"Welcome back!"}
                </Typography>

                <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{
                        visibility: errorMessage ? 'visible' : 'hidden',
                        minHeight: '1em',
                        pb: 5,
                    }}
                >
                    {errorMessage || ' '}
                </Typography>

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
                <Button variant="contained" color="primary" type="submit" fullWidth
                        sx={{marginTop: 1, textTransform: 'none'}} >
                    Login
                </Button>
            </FormStack>

            <Button
                variant="text"
                fullWidth
                onClick={onSwitchToRegister}
                sx={{ mt: 1, textTransform: 'none' }}
            >
                Don't have account?
            </Button>
        </Box>

    );
};

export default LoginForm;


