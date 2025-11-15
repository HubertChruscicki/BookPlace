import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {AuthContextType} from "../models/AuthModels.ts";
import type {User} from "../models/UserModels.ts";
import {apiLogin, apiLogout, fetchCurrentUser} from "../api/auth.api.ts";
import { AuthContext } from './auth.context';

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
        mutateAsync: login,
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

    const { mutateAsync: logout } = useMutation({
        mutationFn: apiLogout,
        onSuccess: () => {
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.clear();
        },
    });

    const isAuthenticated = !!user && !isError;

    const value: AuthContextType = {
        user: user || null,
        isAuthenticated,
        isLoading,
        login,
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