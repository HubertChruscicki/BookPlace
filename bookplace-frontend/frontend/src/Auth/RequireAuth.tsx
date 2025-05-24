import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuth} from "./useAuth.ts";

export const RequireAuth = () => {
    const { auth } = useAuth();
    const loc = useLocation();
    if (!auth.token) {
        return <Navigate to="/" state={{ from: loc }} replace />;
    }
    return <Outlet />;
};