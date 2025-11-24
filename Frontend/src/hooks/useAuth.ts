import { useContext } from 'react';
import type { AuthContextType } from '../models/AuthModels.ts';
import {AuthContext} from "../contexts/auth/auth.context.ts";

export const useAuth = () => {
    const context = useContext<AuthContextType | undefined>(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be located in AuthProvider');
    }
    return context;
};