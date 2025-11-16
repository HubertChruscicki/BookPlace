import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookPlaceLogo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={()=>navigate('/')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <img
        src="/logo.png"
        alt="BookPlace"
        style={{
          height: '48px',
          width: 'auto',
          marginRight: '8px',
        }}
        onClick={()=>navigate('/')}
      />
    </Box>
  );
};

export default BookPlaceLogo;
