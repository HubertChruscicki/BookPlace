import React from 'react';
import { Box, Container } from '@mui/material';
import Header from "../common/header/Header.tsx";
import {theme} from "../../theme.ts";

interface MainLayoutProps {
    children: React.ReactNode;
    showSearch?: boolean;
    centerContent?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children, showSearch = false, centerContent}) => {
    return (
        <Box sx={{ display: 'flex',  flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.paper }}>
            <Header showSearch={showSearch} centerContent={centerContent} />
            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 2 }}>
                {children}
            </Container>
        </Box>
    );
};

export default MainLayout;