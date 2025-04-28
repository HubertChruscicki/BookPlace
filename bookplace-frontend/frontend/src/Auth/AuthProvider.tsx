import React, {useEffect, useState} from "react";
import { AuthContext, IAuth } from "./useAuth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [authCredentials, setAuthCredentials] = useState<IAuth>({})

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);
                setAuthCredentials({ token, user });
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                localStorage.removeItem('user');
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{auth: authCredentials, setAuth: setAuthCredentials}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;