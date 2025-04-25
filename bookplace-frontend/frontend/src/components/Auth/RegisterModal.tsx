import React, {useState} from 'react';
import {Button, Modal, Box, TextField, Typography} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import FormContainer from "../Common/FormContainer.tsx";
import FormStack from '../Common/FormStack.tsx';

export interface RegisterFormData {
    email: string;
    password: string;
}

export interface RegiserModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const RegisterModal: React.FC<RegiserModalProps> = ({isOpen, onClose}) => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const onSubmitHandler: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            console.log("Reigstered in with:", data);
            onClose();
        } catch (error) {
            console.error("Error during register process:", error);
            setErrorMessage("Register failed. Please try again.");
        }
    };

    const defaultLoginValues = {
        email: "",
        password: ""
    };

    const {register, handleSubmit, watch, formState: {errors}} = useForm<RegisterFormData>({
        defaultValues: defaultLoginValues
    });

    return (

        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box>
                <FormContainer
                    title="Sing yourself!"
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

export default RegisterModal;


