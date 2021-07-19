import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { URLS } from '../constants/enums';

export const api = () => {
    return axios.create({
        withCredentials: true,
        baseURL: URLS.BaseApi,
    })
} ;
export const startInterceptor = (token: string, api: AxiosInstance) => {
    api.interceptors.request.use((config: AxiosRequestConfig ) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    })
};

