import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './auth.context';
import type {User} from "../../models/UserModels.ts";
import {apiLogin, apiLogout, apiRegister, fetchCurrentUser} from "../../api/auth.api.ts";
import type {AuthContextType, LoginCredentials, RegisterCredentials, AuthResponse} from "../../models/AuthModels.ts";

const USER_QUERY_KEY = ['currentUser'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: USER_QUERY_KEY,
        queryFn: fetchCurrentUser,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const {
        mutateAsync: loginMutation,
        isPending: isLoggingIn,
        error: loginError
    } = useMutation({
        mutationFn: apiLogin,
        onSuccess: (data) => {
            queryClient.setQueryData(USER_QUERY_KEY, data.user);
        },
        onError: () => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
        }
    });

    const {
        mutateAsync: registerMutation
    } = useMutation({
        mutationFn: apiRegister,
        onSuccess: (data) => {
            queryClient.setQueryData(USER_QUERY_KEY, data.user);
        },
        onError: () => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
        }
    });
    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return await loginMutation(credentials);
    };

    const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return await registerMutation(credentials);
    };

    const { mutateAsync: logout } = useMutation({
        mutationFn: apiLogout,
        onSuccess: () => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Logout error:', error);
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.clear();
        }
    });

    const isAuthenticated = !!user && !isError;

    const value: AuthContextType = {
        user: user || null,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        isLoggingIn,
        loginError: loginError || null,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};