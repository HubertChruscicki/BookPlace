import React from 'react';
import { Modal, Button, TextField } from '@mui/material';

export type AuthMode = 'login' | 'register';

interface AuthModalProps {
    open: boolean;
    mode: AuthMode;
    onClose: () => void;
    onSwitchMode: (mode: AuthMode) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, mode, onClose, onSwitchMode }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div className="p-6 bg-white rounded shadow-lg mx-auto mt-20 max-w-sm">
                <h2 className="text-2xl mb-4">{mode === 'login' ? 'Logowanie' : 'Rejestracja'}</h2>
                <form>
                    {mode === 'register' && (
                        <TextField fullWidth label="Imię i nazwisko" className="mb-4" />
                    )}
                    <TextField fullWidth label="Email" className="mb-4" />
                    <TextField fullWidth type="password" label="Hasło" className="mb-4" />
                    <Button variant="contained" fullWidth>
                        {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                    >
                        {mode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz konto? Zaloguj się'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;
