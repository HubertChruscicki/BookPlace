
import React from 'react';
import { Stack } from '@mui/material';
import { colors } from '../../theme/colors';

interface FormStackProps {
  children: React.ReactNode;
}

const FormStack: React.FC<FormStackProps> = ({ children }) => {
  return (
    <Stack
      spacing={-2}
      sx={{
        '& .MuiTextField-root': {
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: colors.grey[400],
            },
            '& input': {
              color: colors.black[900],
            },

          },
        },
        '& .MuiButton-root': {
          borderRadius: '8px',
          textTransform: 'none',
          py: 1.5,
          fontSize: '1rem',
        },

      }}
    >
      {children}
    </Stack>
  );
};

export default FormStack;
