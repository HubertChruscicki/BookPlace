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

apiClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${baseURL}/auth/refresh`, {}, {
                    withCredentials: true
                });
                return apiClient(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default apiClient;