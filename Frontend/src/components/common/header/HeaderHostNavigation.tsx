import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Typography,
} from '@mui/material';
import {
    Dashboard,
    BookOnline,
    CalendarMonth,
    Home,
    ChatBubbleOutline,
    Menu as MenuIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import type {HostSection} from '../../../models/HostModels';

const NAVIGATION_ITEMS = [
    {
        value: 'dashboard' as HostSection,
        label: 'Dashboard',
        icon: <Dashboard/>,
        path: '/host/dashboard',
    },
    {
        value: 'bookings' as HostSection,
        label: 'Bookings',
        icon: <BookOnline/>,
        path: '/host/bookings',
    },
    {
        value: 'calendar' as HostSection,
        label: 'Calendar',
        icon: <CalendarMonth/>,
        path: '/host/calendar',
    },
    {
        value: 'offers' as HostSection,
        label: 'My Offers',
        icon: <Home/>,
        path: '/host/offers',
    },
    {
        value: 'inbox' as HostSection,
        label: 'Inbox',
        icon: <ChatBubbleOutline/>,
        path: '/host/inbox',
    },
];

export default function HeaderHostNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const currentSection = React.useMemo(() => {
        const pathParts = location.pathname.split('/');
        const section = pathParts[2];
        return section || 'dashboard';
    }, [location.pathname]);

    const handleSectionChange = (section: string) => {
        const item = NAVIGATION_ITEMS.find(item => item.value === section);
        if (item) {
            navigate(item.path);
            setMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const DesktopNavigation = () => (
        <Box
            sx={{
                display: {xs: 'none', md: 'flex'},
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                maxWidth: '100%',
                overflow: 'auto',
            }}
        >
            {NAVIGATION_ITEMS.map((item) => {
                const isActive = currentSection === item.value;
                return (
                    <Chip
                        key={item.value}
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                {React.cloneElement(item.icon, {sx: {fontSize: 18}})}
                                {item.label}
                            </Box>
                        }
                        onClick={() => handleSectionChange(item.value)}
                        sx={{
                            px: 2,
                            py: 0.5,
                            height: 36,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            borderRadius: 20,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            border: 'none',
                            bgcolor: isActive ? 'primary.main' : 'transparent',
                            color: isActive ? 'white' : 'text.primary',
                            '&:hover': {
                                bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                transform: 'translateY(-1px)',
                            },
                            '&:focus': {
                                outline: 'none',
                            },
                        }}
                    />
                );
            })}
        </Box>
    );

    const MobileMenuButton = () => (
        <Box sx={{display: {xs: 'flex', md: 'none'}, alignItems: 'center'}}>
            <IconButton
                onClick={toggleMobileMenu}
                sx={{
                    color: 'text.primary',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
            >
                <MenuIcon/>
            </IconButton>
        </Box>
    );

    const MobileMenu = () => (
        <Drawer
            anchor="top"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            sx={{
                display: {xs: 'block', md: 'none'},
                '& .MuiDrawer-paper': {
                    width: '100%',
                    height: '100vh',
                    bgcolor: 'background.paper',
                    p: 0,
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" sx={{fontWeight: 600}}>
                    Dashboard
                </Typography>
                <IconButton onClick={() => setMobileMenuOpen(false)}>
                    <CloseIcon/>
                </IconButton>
            </Box>

            <Box sx={{flex: 1, p: 2}}>
                <List sx={{p: 0}}>
                    {NAVIGATION_ITEMS.map((item) => {
                        const isActive = currentSection === item.value;
                        return (
                            <ListItem
                                key={item.value}
                                onClick={() => handleSectionChange(item.value)}
                                sx={{
                                    mb: 1,
                                    cursor: 'pointer',
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    borderRadius: 20,
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'white' : 'primary.main',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '1rem',
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );

    return (
        <>
            <DesktopNavigation/>
            <MobileMenuButton/>
            <MobileMenu/>
        </>
    );
}
