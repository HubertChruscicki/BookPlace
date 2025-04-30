import React from 'react';
import {Modal, Box} from '@mui/material';
import LoginForm from "./LoginForm.tsx";
import RegisterForm from "./RegisterForm.tsx";

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
    open: boolean;
    mode: AuthMode;
    onClose: () => void;
    onSwitchMode: (mode: AuthMode) => void;
}

//TODO CHECK THE ERROR RESPONDS
const AuthModal: React.FC<AuthModalProps> = ({ open, mode, onClose, onSwitchMode }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: "25vw",
                    maxWidth: "500px",
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 5,
                    p: 4,
                    outline: 'none',
                }}
            >
                {mode === 'login'
                    ? <LoginForm onClose={onClose} onSwitchToRegister={() => onSwitchMode('register')} />
                    : <RegisterForm onClose={onClose} onSwitchToLogin={() => onSwitchMode('login')} />
                }
            </Box>
        </Modal>
    );
};

export default AuthModal;
