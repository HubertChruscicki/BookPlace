import React from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm, Controller, type ControllerRenderProps } from 'react-hook-form';
import type { RegisterCredentials } from '../../../models/AuthModels';

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  isLoading
}) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterCredentials>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
      surname: '',
      phoneNumber: '',
      confirmPassword: '',
    }
  });

  const password = watch('password');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: 4, py: 3, pb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: -1 }}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'First name is required',
            minLength: {
              value: 2,
              message: 'Invalid name'
            },
            pattern: {
              value: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
              message: 'Invalid name'
            }
          }}
          render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'name'> }) => (
            <TextField
              {...field}
              fullWidth
              label="First Name"
              autoComplete="given-name"
              error={!!errors.name}
              helperText={errors.name?.message || ' '}
            />
          )}
        />
        
        <Controller
          name="surname"
          control={control}
          rules={{
            required: 'Last name is required',
            minLength: {
              value: 2,
              message: 'Invalid lastname'
            },
            pattern: {
              value: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
              message: 'Invalid lastname'
            }
          }}
          render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'surname'> }) => (
            <TextField
              {...field}
              fullWidth
              label="Last Name"
              autoComplete="family-name"
              error={!!errors.surname}
              helperText={errors.surname?.message || ' '}
            />
          )}
        />
      </Box>
      
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
        render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'email'> }) => (
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
        name="phoneNumber"
        control={control}
        rules={{
          required: 'Phone number is required',
          pattern: {
            value: /^[+]?[1-9][\d\s\-()]{7,15}$/,
            message: 'Please enter a valid phone number'
          }
        }}
        render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'phoneNumber'> }) => (
          <TextField
            {...field}
            fullWidth
            label="Phone Number"
            margin="normal"
            autoComplete="tel"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message || ' '}
            placeholder="+48 123 456 789"
            sx={{mb: -1 }}
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
        render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'password'> }) => (
          <TextField
            {...field}
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message || ' '}
            sx={{ mb: -1 }}
          />
        )}
      />
      
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: 'Please confirm your password',
          validate: (value) => value === password || 'Passwords do not match'
        }}
        render={({ field }: { field: ControllerRenderProps<RegisterCredentials, 'confirmPassword'> }) => (
          <TextField
            {...field}
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message || ' '}
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>
      
      <Typography variant="body2" textAlign="center">
        Already have an account?{' '}
        <Button
          variant="text"
          onClick={onSwitchToLogin}
          sx={{ 
            textTransform: 'none', 
            p: 0, 
            minWidth: 'auto',
            color: 'primary.main',
            fontWeight: 'medium'
          }}
        >
          Sign in
        </Button>
      </Typography>
    </Box>
  );
};

export default RegisterForm;

