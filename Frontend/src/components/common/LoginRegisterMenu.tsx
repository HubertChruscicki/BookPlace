import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import AuthModal from '../features/auth/AuthModal';

interface LoginRegisterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const LoginRegisterMenu: React.FC<LoginRegisterMenuProps> = ({
  anchorEl,
  open,
  onClose
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
    onClose();
  };

  const handleRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
    onClose();
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 150,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogin}>
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </MenuItem>

        <MenuItem onClick={handleRegister}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Register" />
        </MenuItem>
      </Menu>

      <AuthModal
        open={authModalOpen}
        onClose={handleAuthModalClose}
        initialTab={authModalMode}
      />
    </>
  );
};

export default LoginRegisterMenu;
