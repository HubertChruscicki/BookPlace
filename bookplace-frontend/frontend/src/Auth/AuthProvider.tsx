import React, {useEffect, useState} from "react";
import { AuthContext, IAuth } from "./useAuth";
import AuthModal, {AuthMode} from "../components/Auth/AuthModal.tsx"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [authCredentials, setAuthCredentials] = useState<IAuth>(() => {
        const token = localStorage.getItem("token") || undefined;
        const userJson = localStorage.getItem("user");
        if (token && userJson) {
            try {
                return { token, user: JSON.parse(userJson) };
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
            }
        }
        return {};
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<AuthMode>("login");

    const openAuthModal = (mode: AuthMode) => {
        setIsModalOpen(true);
        setModalMode(mode);
    }

    const closeAuthModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (authCredentials.token && authCredentials.user) {
            localStorage.setItem('token', authCredentials.token);
            localStorage.setItem('user', JSON.stringify(authCredentials.user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [authCredentials]);

    return (
        <AuthContext.Provider value={{
            auth: authCredentials,
            setAuth: setAuthCredentials,
            openAuthModal,
            closeAuthModal
        }}>
            {children}
            <AuthModal
                open={isModalOpen}
                mode={modalMode}
                onClose={closeAuthModal}
                onSwitchMode={openAuthModal}
            />
        </AuthContext.Provider>
    )

}

export default AuthProvider;