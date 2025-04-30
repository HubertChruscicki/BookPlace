import axios from "axios";
import { BASE_API_URL } from './const';

const api = axios.create({
    baseURL: BASE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

let isTokenRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (token) {
            promise.resolve(token);
        } else {
            promise.reject(error);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && (error.response.status === 401 || error.response.status === 500) && !originalRequest._retry) {
            if (isTokenRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                })
                .then((token)=> {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                })
                .catch((error) => Promise.reject(error))
            }
            originalRequest._retry = true;
            isTokenRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                if(!refreshToken) {
                    throw new Error("Refresh token is missing");
                }
                const response = await axios.post(`${BASE_API_URL}/auth/refresh/`, {
                    refresh_token: refreshToken
                })
                const newToken = response.data.token;
                localStorage.setItem("token", newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (error) {
                processQueue(error, null);
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
            } finally {
                isTokenRefreshing = false;
            }
        }
        if (axios.isAxiosError(error) && error.response?.data?.error) {
            error.message = error.response.data.error;
        }
        return Promise.reject(error);
    }
);

export default api;
