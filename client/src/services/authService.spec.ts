import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import AuthService from './AuthService';
import { URLS } from '../constants/enums';

jest.mock('axios');

describe('AuthService tests', () => {
    const email = 'fakeEmail';
    const password = 'fakePassword';
    const fakeToken = 'fakeToken';
    const config = {
        headers: {
            'Authorization': `Refresh ${fakeToken}`
        }
    };
    const context = {
        req: {
            headers: {
                cookie: `refreshToken=${fakeToken}`
            }
        }
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>;
    const userData = {
        message: 'success',
        user: {
            accessToken: fakeToken,
            refreshToken: fakeToken,
            user: {
                email,
                isActivated: true,
                id: '0123456789'
            }
        }
    };

    beforeEach(() => {
        jest.resetAllMocks()
    })
    
    it('isLogin should GET to isLogin with refreshToken', () => {   
        AuthService.isLogin(axios, context);
        expect((axios.get as jest.Mock).mock.calls).toEqual([[URLS.IsLogin, config]])
    });
    it('isLogin should GET to isLogin with empty refreshToken', () => {
        const context2 = JSON.parse(JSON.stringify(context));
        const config2 = JSON.parse(JSON.stringify(config));
        config2.headers.Authorization = `Refresh `;
        context2.req.headers.cookie = '';
        AuthService.isLogin(axios, context2);
        expect((axios.get as jest.Mock).mock.calls).toEqual([[URLS.IsLogin, config2]])
    })
    it('isLogin should return boolean value', async () => {
        const result = true;
        (axios.get as jest.Mock).mockResolvedValue(result);
        const data = await AuthService.isLogin(axios, context);
        return expect(data).toEqual(result);
    });

    it('login should POST to login with email and password', () => {
        AuthService.login(axios, email, password);
        expect((axios.post as jest.Mock).mock.calls).toEqual([[URLS.Login, {email, password}]]);
    });
    it('login should return success message and user data', () => {
        (axios.post as jest.Mock).mockResolvedValue(userData);
        return AuthService.login(axios, email, password).then(data => expect(data).toEqual(userData));
    });

    it('registration should POST to signup with email and password', () => {
        AuthService.registation(axios, email, password);
        expect((axios.post as jest.Mock).mock.calls).toEqual([[URLS.Signup, {email, password}]]);
    });
    it('registration should return success message and user data', async () => {
        (axios.post as jest.Mock).mockResolvedValue(userData);
        const recieved = await AuthService.registation(axios, email, password);
        expect(recieved).toEqual(userData);
    });

    it('refresh should GET to refresh', () => {
        AuthService.refresh(axios);
        expect((axios.get as jest.Mock).mock.calls).toEqual([[URLS.Refresh]]);
    });
    it('logout should GET to logout', () => {
        AuthService.logout(axios);
        expect((axios.get as jest.Mock).mock.calls).toEqual([[URLS.Logout]]);
    });
});
