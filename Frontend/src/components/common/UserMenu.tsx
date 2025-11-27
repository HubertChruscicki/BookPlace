import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
    AccountCircleOutlined as PersonIcon,
    HomeWorkOutlined as HomeIcon,
    CardTravel as BookingIcon,
    ReviewsOutlined as ReviewIcon,
    ExitToApp as LogoutIcon,
    ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../models/UserModels';

interface UserMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, anchorEl, open, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handleMyBookings = () => {
    navigate('/my-bookings');
    onClose();
  };
  const handleGuestInbox = () => {
    navigate('/inbox');
    onClose();
  };



  const handleHostPanel = () => {
    navigate('/host/dashboard');
    onClose();
  };

  const isHost = user.roles.includes('Host');

    const menuItemStyles = {
        py: 1.1,
    };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
          disablePadding: true,
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
              boxShadow: 3,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >

      {isHost && (
        <>
          <MenuItem onClick={handleHostPanel} sx={menuItemStyles}>
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Host Panel" />
          </MenuItem>
        </>
      )}

      <MenuItem onClick={handleGuestInbox} sx={menuItemStyles}>
        <ListItemIcon>
          <ChatIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </MenuItem>

      <MenuItem onClick={onClose} sx={menuItemStyles}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="User Profile" />
      </MenuItem>

      <MenuItem onClick={handleMyBookings} sx={menuItemStyles}>
        <ListItemIcon>
          <BookingIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="My Reservations" />
      </MenuItem>

      <MenuItem onClick={onClose} sx={menuItemStyles}>
        <ListItemIcon>
          <ReviewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Reviews" />
      </MenuItem>

      <MenuItem onClick={onClose} sx={menuItemStyles}>
        <ListItemIcon>
          <BookingIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Saved" />
      </MenuItem>

      <MenuItem onClick={handleLogout} sx={menuItemStyles}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
