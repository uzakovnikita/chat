import { AxiosInstance, AxiosResponse } from 'axios';
import { IAuthResponse, IIsLoginResponse } from '../constants/interfaces';
import { URLS } from '../constants/enums';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export default class AuthService {

    static async isLogin(api: AxiosInstance, context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<AxiosResponse<IIsLoginResponse>> {
        const cookies = '' + context.req.headers.cookie;
        const refreshToken = cookies
            .split('; ')
            .reduce((acc: string, el: string) => {
                const reg = /refreshToken=/;
                if (reg.test(el)) {
                    return (acc = el.replace(/refreshToken=/, ''));
                }
                return acc;
            }, '');

        const config = {
            headers: {
                'Authorization': `Refresh ${refreshToken}`
            }
        }
        return api.get(URLS.IsLogin, config);
    }

    static async isLoginOnClient(api: AxiosInstance): Promise<AxiosResponse<IIsLoginResponse>> {
        return api.get(URLS.IsLogin);
    }

    static async login(api: AxiosInstance, email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post<IAuthResponse>(URLS.Login, {email, password})
    }

    static async registation(api: AxiosInstance, email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post<IAuthResponse>(URLS.Signup, {email, password})
    }

    static async refresh(api: AxiosInstance): Promise<void> {
        api.get(URLS.Refresh);
    }

    static async logout(api: AxiosInstance): Promise<void> {
        return api.get(URLS.Logout);
    }
}
