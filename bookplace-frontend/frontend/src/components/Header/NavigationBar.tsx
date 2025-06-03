import {Box, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import {colors} from "../../theme/colors.ts";

const NavigationBar: React.FC = () => {
    const location = useLocation();
    const [activePage, setActivePage] = useState("");

    useEffect(() => {
        const path = location.pathname;
        const pathParts = path.split("/");
        const page = pages.find(p => pathParts.includes(p.name))?.name || "";
        setActivePage(page);
    }, [location]);

    const pages = [
        { name: "calendar", link: "/landlord/calendar" },
        { name: "offers", link: "/landlord/offers" },
        { name: "messages", link: "/landlord/messages" },
        { name: "reservations", link: "/landlord/reservations" },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', lg: "flex" }, alignItems: 'center', gap: '2rem' }}>
                {pages.map((page) => (
                    <Button
                        key={page.name}
                        component={Link}
                        to={page.link}
                        sx={{
                            height: '100%',
                            textTransform: 'capitalize',
                            letterSpacing: '0.06rem',
                            fontWeight: 400,
                            fontSize: "1rem",
                            position: 'relative',
                            color: activePage === page.name ? colors.blue[600] : colors.black[900],
                            "&:hover": {
                                backgroundColor: 'transparent',
                                color: colors.blue[600],
                            },
                            "&::after": {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: activePage === page.name ? '100%' : '0',
                                height: '2px',
                                backgroundColor: colors.blue[600],
                                transition: 'width 0.3s ease',
                                borderRadius: '10px',
                            }
                        }}
                    >
                        {page.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default NavigationBar;