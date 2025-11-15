import { useContext } from 'react';
import type { AuthContextType } from '../models/AuthModels.ts';
import {AuthContext} from "../contexts/auth.context.ts";

export const useAuth = () => {
    const context = useContext<AuthContextType | undefined>(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth musi być używany wewnątrz AuthProvider');
    }
    return context;
};