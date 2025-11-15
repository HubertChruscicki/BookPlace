import { createContext } from 'react';
import type { AuthContextType } from '../models/AuthModels';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);