import {Avatar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
import React from "react";
import {colors} from "../../theme/colors.ts"
import {
    AccountCircleOutlined as AccountIcon,
    HomeWorkOutlined as OffersIcon,
    CardTravel as ReservationsIcon,
    ReviewsOutlined as ReviewsIcon,
    FavoriteBorderOutlined as SavedIcon,
    ExitToApp as LogoutIcon,
    LoginOutlined as LoginIcon,
    VpnKeyOutlined as RegisterIcon,
} from "@mui/icons-material";
import { useAuth } from "../../Auth/useAuth.ts";

const iconStyles = {
    padding: '4px',
    width: 30,
    height: 30,
    borderRadius: '50%',
};

const ProfileBlock: React.FC = () => {

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { auth, setAuth, openAuthModal } = useAuth();
    const isLogged = Boolean(auth.token);
    const roles = auth.user?.roles ?? [];

    const settings: { label: string; icon: JSX.Element }[] = [];

    if (!isLogged) {
        settings.push(
            { label: "Login", icon: <LoginIcon sx={iconStyles} /> },
            { label: "Register", icon: <RegisterIcon sx={iconStyles} /> }
        );
    } else {
        settings.push(
            { label: "My account", icon: <AccountIcon sx={iconStyles} /> }
        );

        if (roles.includes("landlord")) {
            settings.push({ label: "My offers", icon: <OffersIcon sx={iconStyles} /> });
        }

        settings.push(
            { label: "Reservations", icon: <ReservationsIcon sx={iconStyles} /> },
            { label: "Reviews",      icon: <ReviewsIcon      sx={iconStyles} /> },
            { label: "Saved",        icon: <SavedIcon        sx={iconStyles} /> },
            { label: "Logout", icon: <LogoutIcon sx={iconStyles} /> }
        );
    }




    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (label: string) => {
        setAnchorElUser(null);
        if (label === "Login") {
            openAuthModal("login")
        }
        if (label === "Register") {
            openAuthModal("register");
        }
        if (label === "Logout") {
            setAuth({});
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
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