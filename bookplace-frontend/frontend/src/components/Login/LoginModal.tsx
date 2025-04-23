import React, {useState} from 'react';
import {Button, Modal, Box, TextField, Typography} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import FormContainer from "../Common/FormContainer.tsx";
import FormStack from '../Common/FormStack.tsx';

export interface LoginFormData {
    email: string;
    password: string;
}

export interface EventFormProps {
    isOpen: boolean;
    onClose: () => void;
}


const LoginModal: React.FC<EventFormProps> = ({isOpen, onClose}) => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const onSubmitHandler: SubmitHandler<LoginFormData> = async (data) => {
        try {
            console.log("Logging in with:", data);
            onClose();
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Login failed. Please try again.");
        }
    };

    const defaultLoginValues = {
        email: "",
        password: ""
    };

    const {register, handleSubmit, watch, formState: {errors}} = useForm<LoginFormData>({
        defaultValues: defaultLoginValues
    });

    return (

        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box>
                <FormContainer
                    title="Welcome back!"
                    onSubmit={handleSubmit(onSubmitHandler)}
                    modal={true}
                    onClose={()=>{
                        onClose();
                    }}
                >
                    <FormStack>
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


                        {errorMessage && (
                            <Typography variant="body2" color="error" align="center">
                                {errorMessage}
                            </Typography>
                        )}
                    </FormStack>

                    <Button variant="contained" color="primary" type="submit" fullWidth
                            sx={{marginTop: 2, textTransform: 'none'}}>
                        Login
                    </Button>
                </FormContainer>
            </Box>
        </Modal>

    );
};

export default LoginModal;


