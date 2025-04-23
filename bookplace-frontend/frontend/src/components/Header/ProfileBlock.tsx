import {Avatar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
import React from "react";
import {colors} from "../../theme/colors.ts"
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';

const iconStyles = {
    padding: '4px',
    width: 30,
    height: 30,
    borderRadius: '50%',
};

export interface ProfileBlockProps {
    isLogged: boolean;
    onModalOpen: () => void;
}

const ProfileBlock: React.FC<ProfileBlockProps> = ({isLogged, onModalOpen}) => {

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const settings = isLogged ?
        [
            { label: "My account", icon: <AccountCircleOutlinedIcon sx={iconStyles} /> },
            { label: "My offers", icon: <HomeWorkOutlinedIcon sx={iconStyles} /> },
            { label: "Reservations", icon: <CardTravelIcon sx={iconStyles} /> },
            { label: "Reviews", icon: <ReviewsOutlinedIcon sx={iconStyles} /> },
            { label: "Saved", icon: <FavoriteBorderOutlinedIcon sx={iconStyles} /> },
            { label: "Logout", icon: <ExitToAppIcon sx={iconStyles} /> }
        ] :
        [
            { label: "Login", icon: <LoginOutlinedIcon sx={iconStyles} /> },
            { label: "Register", icon: <VpnKeyOutlinedIcon sx={iconStyles} /> }
        ];



    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (label: string) => {
        setAnchorElUser(null);
        if (label === "Login") {
            onModalOpen();
        }
    };

    return (
        <Box sx={{flexGrow: 0}}>
            <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                    display: "flex",
                    gap: 2,
                    border: `0.05px solid ${colors.grey[300]}`,
                    borderRadius: "30px",
                    padding: 1,
                    alignItems: "center"
                }}>
                <Typography
                    sx={{
                        color: `${colors.black[900]}`,
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        ml: 1
                    }}>
                    ☰
                </Typography>
                <Avatar
                    alt="Remy Sharp"
                    sx={{ width: 36, height: 36, mr: 1 }}
                />

            </IconButton>
            <Menu
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        mt: 6,
                    },
                }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu('')}
            >
            {settings.map((setting) => (
                <MenuItem key={setting.label} onClick={()=>handleCloseUserMenu(setting.label)}>
                    <ListItemIcon>{setting.icon}</ListItemIcon>
                    <ListItemText sx={{mx: "8px"}} primary={setting.label} />
                </MenuItem>
            ))}
            </Menu>
        </Box>
    );
}
export default ProfileBlock;