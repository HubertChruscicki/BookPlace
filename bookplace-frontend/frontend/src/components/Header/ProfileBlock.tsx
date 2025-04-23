import {Avatar, Box, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import React from "react";
import {colors} from "../../theme/colors.ts"
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {ArrowForwardIos} from "@mui/icons-material";

const iconStyles = {
    padding: '4px',
    bgcolor: colors.grey[100],
    width: 30,
    height: 30,
    borderRadius: '50%',
};

export interface ProfileBlockProps {
    isLogged: boolean;
}

const ProfileBlock: React.FC<ProfileBlockProps> = ({isLogged}) => {

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const settings = [
        { label: "My account", icon: <PersonIcon sx={iconStyles} /> },
        { label: "Reservations", icon: <CardTravelIcon sx={iconStyles} /> },
        { label: "Reviews", icon: <ReviewsOutlinedIcon sx={iconStyles} /> },
        { label: "Saved", icon: <FavoriteBorderOutlinedIcon sx={iconStyles} /> },
        { label: "Logout", icon: <ExitToAppIcon sx={iconStyles} /> },
    ];

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (setting: string) => {
        setAnchorElUser(null);
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
                sx={{
                    mt: 6
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