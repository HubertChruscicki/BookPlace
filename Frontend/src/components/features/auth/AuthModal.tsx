import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import type { LoginCredentials, RegisterCredentials } from '../../../models/AuthModels';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialTab = 'login' }) => {
  const [tabValue, setTabValue] = useState(initialTab === 'login' ? 0 : 1);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLoginSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      await register(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const switchToRegister = () => {
    setTabValue(1);
    setError('');
  };

  const switchToLogin = () => {
    setTabValue(0);
    setError('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: 420,
            mx: 2,
          }
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box>
          <Box sx={{ px: 3, pt: 3, pb: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab 
                label="Login" 
                sx={{ 
                  fontWeight: 'medium',
                  textTransform: 'none',
                  fontSize: '1rem'
                }} 
              />
              <Tab 
                label="Register" 
                sx={{ 
                  fontWeight: 'medium',
                  textTransform: 'none',
                  fontSize: '1rem'
                }} 
              />
            </Tabs>
          </Box>

          {error && (
            <Box sx={{ px: 3, pt: 2 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          <TabPanel value={tabValue} index={0}>
            <LoginForm
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={switchToRegister}
              isLoading={isLoading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <RegisterForm
              onSubmit={handleRegisterSubmit}
              onSwitchToLogin={switchToLogin}
              isLoading={isLoading}
            />
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
