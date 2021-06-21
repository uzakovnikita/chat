import {api} from '../http/index';
import { AxiosResponse } from 'axios';
import { IAuthResponse } from '../constants/interfaces';

export default class AuthService {

    static async login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post<IAuthResponse>('/auth/login', {email, password})
    }

    static async registation(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post<IAuthResponse>('/auth/register', {email, password})
    }

    static async logout(): Promise<void> {
        return api.get('/logout');
    }
}
