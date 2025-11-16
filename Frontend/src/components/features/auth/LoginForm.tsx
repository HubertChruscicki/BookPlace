import React from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm, Controller, type ControllerRenderProps } from 'react-hook-form';
import type { LoginCredentials } from '../../../models/AuthModels';

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
  isLoading
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: 4, py: 3, pb: 4 }}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }
        }}
        render={({ field }: { field: ControllerRenderProps<LoginCredentials, 'email'> }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message || ' '}
            sx={{ mb: -1 }}
          />
        )}
      />
      
      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long'
          }
        }}
        render={({ field }: { field: ControllerRenderProps<LoginCredentials, 'password'> }) => (
          <TextField
            {...field}
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message || ' '}
            sx={{ mb: -1 }}
          />
        )}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{
          py: 1.5,
          mt: 2,
          mb: 3,
          bgcolor: 'primary.main',
          fontWeight: 'bold',
          fontSize: '1rem',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
      
      <Typography variant="body2" textAlign="center">
        Don't have an account?{' '}
        <Button
          variant="text"
          onClick={onSwitchToRegister}
          sx={{ 
            textTransform: 'none', 
            p: 0, 
            minWidth: 'auto',
            color: 'primary.main',
            fontWeight: 'medium'
          }}
        >
          Sign up
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;


