import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import {useAuth} from "../../../hooks/useAuth.ts";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {

        const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));

        if (!hasRequiredRole) {
            console.warn(`User ${user.email} attempted access to restricted route. Missing role.`);
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;