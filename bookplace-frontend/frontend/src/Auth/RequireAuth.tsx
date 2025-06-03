import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuth} from "./useAuth.ts";



interface AuthProps {
    requiredRole?: string[];
}

export const RequireAuth: React.FC<AuthProps> = ({requiredRole}) => {
    const { auth } = useAuth();


    const loc = useLocation();
    if (!auth.token || !auth.user?.role || !requiredRole || !requiredRole.includes(auth.user.role)) {
        return <Navigate to="/" state={{ from: loc }} replace />;
    }
    return <Outlet />;
};