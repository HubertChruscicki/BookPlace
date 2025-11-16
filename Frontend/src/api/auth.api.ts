import apiClient from './apiClient';
import type {User} from "../models/UserModels.ts";
import type {AuthResponse, LoginCredentials, RegisterCredentials} from "../models/AuthModels.ts";

export const fetchCurrentUser = async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
};

export const apiLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
};

export const apiRegister = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return data;
};

export const apiLogout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};
