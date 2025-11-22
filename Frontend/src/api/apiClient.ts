import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const baseURL = import.meta.env.VITE_BASE_API_URL || '/api';

const customParamsSerializer = (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item !== undefined && item !== null) {
                            searchParams.append(key, item.toString());
                        }
                    });
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        }
    }

    return searchParams.toString();
};

const apiClient = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: {
        serialize: customParamsSerializer
    },
});

const AUTH_ENDPOINTS_TO_EXCLUDE = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/me'];

apiClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const statusCode = error.response?.status;
        const url = originalRequest.url ?? '';

        const isAuthEndpoint = AUTH_ENDPOINTS_TO_EXCLUDE.some(endpoint => url.endsWith(endpoint));
        
        if (isAuthEndpoint) {
            console.warn(`401 on Auth endpoint (${url}). Bypassing token refresh logic.`);
            return Promise.reject(error);
        }
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${baseURL}/auth/refresh`, {}, {
                    withCredentials: true
                });
                return apiClient(originalRequest);

            } catch (refreshError) {
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        if (statusCode === 403) {
            console.error('403 Forbidden: Access denied to this resource.');
            window.location.href = '/403'; 
        }

        return Promise.reject(error);
    }
);


export default apiClient;