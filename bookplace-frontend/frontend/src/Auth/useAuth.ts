import React, {createContext, useContext} from "react";

export interface IUserCredntials {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    roles: string[];
}

export interface IAuth {
    token?: string;
    user?: IUserCredntials;
}

export interface IAuthContext {
    auth: IAuth;
    setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = () => useContext(AuthContext);
