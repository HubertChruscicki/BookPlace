import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {theme} from "../../theme.ts";

const BookPlaceLogo: React.FC = () => {

    const desktopLogoSrc = "/logo.png";
    const mobileLogoSrc = "/logoSolo.png";
    
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const logoSrc = isMobile ? mobileLogoSrc : desktopLogoSrc;
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
          src={logoSrc} 
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
