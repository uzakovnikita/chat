import AuthPage from './auth';
import { getServerSideProps } from './auth';

import useAuth from '../hooks/useAuth';

import Auth from '../store/Auth';
import ErrorsLogs from '../store/ErrorsLogs';

import AuthService from '../services/AuthService';

import prepareWrappForPage from '../utils/prepareWrappForPage';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

const idPortal = 'error-portal';
const pageAttr = '[data-test="authPage"]';
const pageContentAttr = '[data-test="authPageContent"]';
const loginComponent = 'Login[data-test="loginComponent"]';
const toggleButton = 'button[data-test="toggleButton"]';
const fakeContext = {} as GetServerSidePropsContext<ParsedUrlQuery>;
const unauthorizedError = 'request failed, status: 401';
const serverError = 'request failed, status: 500';

jest.mock('../hooks/useAuth');

describe('AuthPage', () => {
    let authStore: undefined | Auth;
    let errorsLogsStore: undefined | ErrorsLogs;
    let portalContainer: undefined | HTMLDivElement;

    beforeAll(() => {
        errorsLogsStore = new ErrorsLogs();
        authStore = new Auth();
        (useAuth as jest.Mock).mockImplementation(() => {});
        portalContainer = document.createElement('div');
        portalContainer.setAttribute('id', idPortal);
        document.body.appendChild(portalContainer);
    });

    it('Should render AuthPage', () => {
        const page = prepareWrappForPage(AuthPage, {
            authStore,
            errorsLogsStore,
        });
        const dataPage = page?.find(pageAttr);
        expect(dataPage?.length).toBe(2);
    });

    it('Should render empty content when is login', () => {
        authStore!.isLogin = true;
        const page = prepareWrappForPage(AuthPage, {
            authStore,
            errorsLogsStore,
        });
        const dataPageContent = page?.find(pageContentAttr);    
        expect(dataPageContent?.length).toBe(0);
    });

    it('Should render non-empty content when is not login', () => {
        authStore!.isLogin = false;
        const page = prepareWrappForPage(AuthPage, {
            authStore,
            errorsLogsStore,
        });
        const dataPageContent = page?.find(pageContentAttr);
        expect(dataPageContent?.length).toBe(2);
    });

    it('Should toggle state on click', () => {
        authStore!.isLogin = false;
        const page = prepareWrappForPage(AuthPage, {
            authStore,
            errorsLogsStore,
        });
        const button = page?.find(toggleButton);

        button!.simulate('click');
        let result = page?.find(loginComponent).length;
        expect(result).toBe(1);

        button!.simulate('click');
        result = page?.find(loginComponent).length;
        expect(result).toBe(0);
    });
});

describe('getServerSideProp from authPage', () => {

    beforeAll(() => {
        jest.mock('../services/AuthService');
    });

    it('Should return expected props when the user is logged in', async () => {
        const mockIsLogin = jest.fn();
        AuthService.isLogin = mockIsLogin;
        const result = await getServerSideProps(fakeContext);
        expect(result).toEqual({
            props: {
                initialAuthStore: {
                    isLogin: true,
                    isHydrated: true,
                },
            },
        });
    });
    it('Should return expected props when the user is not logged in', async () => {
        const genError = jest.fn(() => {
            throw new Error(unauthorizedError);
        });
        AuthService.isLogin = genError;
        const result = await getServerSideProps(fakeContext);
        expect(result).toEqual({
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                },
                initialErrorsLogs: {
                    errors: [],
                },
            },
        });
    });
    it('Should return expected props when the request fails with an unexpected error', async () => {
        const genError = jest.fn(() => {
            throw new Error(serverError);
        });
        const error = new Error(serverError);
        AuthService.isLogin = genError;
        const result = await getServerSideProps(fakeContext);
        expect(result).toEqual({
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                },
                initialErrorsLogs: {
                    errors: [error.message],
                },
            },
        });
    });
});
