import { createContext } from 'react';
import type {AuthContextType} from "../../models/AuthModels.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);