import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import UserMenu from '../../common/UserMenu';
import LoginRegisterMenu from '../../common/LoginRegisterMenu';
import AuthModal from '../../features/auth/AuthModal';
import { UserButton, SignInButton, SignUpButton } from './Header.styles';

const HeaderUserSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAuth();
  
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [loginMenuAnchor, setLoginMenuAnchor] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleLoginMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLoginMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setUserMenuAnchor(null);
    setLoginMenuAnchor(null);
  };

  const handleSignInClick = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      {isAuthenticated && user ? (
        isMobile ? (
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar
              src={user.profilePictureUrl || undefined}
              alt={`${user.name} ${user.surname}`}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        ) : (
          <UserButton
            variant="outlined"
            onClick={handleUserMenuOpen}
            startIcon={
              <Avatar
                src={user.profilePictureUrl || undefined}
                alt={`${user.name} ${user.surname}`}
                sx={{ width: 28, height: 28 }}
              />
            }
          >
            {user.name} {user.surname}
          </UserButton>
        )
      ) : (
        isMobile ? (
          <IconButton onClick={handleLoginMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }} />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <SignInButton
              variant="contained"
              onClick={handleSignInClick}
            >
              Sign In
            </SignInButton>
            <SignUpButton
              variant="outlined"
              onClick={handleSignUpClick}
            >
              Sign Up
            </SignUpButton>
          </Box>
        )
      )}

      {isAuthenticated && user && (
        <UserMenu
          user={user}
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleMenuClose}
        />
      )}

      {!isAuthenticated && (
        <>
          <LoginRegisterMenu
            anchorEl={loginMenuAnchor}
            open={Boolean(loginMenuAnchor)}
            onClose={handleMenuClose}
          />
          <AuthModal
            open={authModalOpen}
            onClose={handleAuthModalClose}
            initialTab={authModalMode}
          />
        </>
      )}
    </>
  );
};

export default HeaderUserSection;
