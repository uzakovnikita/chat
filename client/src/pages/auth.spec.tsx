import { Component } from 'react';
import { ReactWrapper } from 'enzyme';

import AuthPage from './auth';

import Auth from '../store/Auth'
import ErrorsLogs from '../store/ErrorsLogs';

import prepareWrappForPage from '../utils/prepareWrappForPage';


describe('with enzyme', () => {
    describe('AuthPage', () => {
        let page:
            | ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>
            | undefined;
        let authStore: undefined | Auth;
        let errorsLogsStore: undefined | ErrorsLogs;

        beforeAll(() => {
            errorsLogsStore = new ErrorsLogs();
            authStore = new Auth();
            const portalContainer = document.createElement('div');
            portalContainer.setAttribute('id', 'error-portal');
            document.body.appendChild(portalContainer);
            page = prepareWrappForPage(AuthPage, {authStore, errorsLogsStore})          
        });

        it('Should render AuthPage', () => {
            const dataPage = page?.find(`main[data-test="authPage"]`);
            console.log(page?.debug())
            expect(dataPage?.length).toBe(1);
        });

        it('Should render empty content when is not login', () => {
            authStore!.isLogin = true;
            page = prepareWrappForPage(AuthPage, {authStore, errorsLogsStore})
            const dataPageContent = page?.find(`[data-test="authPageContent"]`);
            expect(dataPageContent?.length).toBe(0);
        });

        // it('Should be renderer as in the snapshot', () => {
        //     expect(page).toMatchSnapshot();
        // })
    });
});
