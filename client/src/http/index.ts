import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { URLS } from '../constants/enums';

export const api = () => axios.create({
    withCredentials: true,
    baseURL: URLS.BaseApi,
});
export const startInterceptor = (token: string, api: AxiosInstance) => {
    api.interceptors.request.use((config: AxiosRequestConfig ) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    })
};
export const clientSideApi = api();
export const clientSideStartInterceptor = (token: string) => {
    clientSideApi.interceptors.request.use((config: AxiosRequestConfig ) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    })
};
