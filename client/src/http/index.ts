import axios, { AxiosRequestConfig } from 'axios';
import { URLS } from '../constants/enums';

export const api = axios.create({
    withCredentials: true,
    baseURL: URLS.BaseApi,
});

export const startInterceptor = (token: string) => {
    api.interceptors.request.use((config: AxiosRequestConfig ) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    })
};
