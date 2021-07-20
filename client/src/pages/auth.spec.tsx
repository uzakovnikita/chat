import { Component } from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';

import AuthPage from './auth';

import Auth from '../store/Auth'
import ErrorsLogs from '../store/ErrorsLogs';
import { ContextAuth, ContextErrorsLogs } from '../store/contexts';

import { theme } from '../constants/theme';

describe('with enzyme', () => {
    describe('AuthPage', () => {
        let page:
            | ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>
            | undefined;
        beforeAll(() => {
            const authStore = new Auth();
            const errorsLogsStore = new ErrorsLogs();
            const portalContainer = document.createElement('div');
            portalContainer.setAttribute('id', 'error-portal');
            document.body.appendChild(portalContainer);
            page = mount(
                <ThemeProvider theme={theme}>
                    <ContextErrorsLogs.Provider value={errorsLogsStore}>
                    <ContextAuth.Provider value={authStore}>
                        <AuthPage />
                    </ContextAuth.Provider>
                    </ContextErrorsLogs.Provider>
                </ThemeProvider>,
            );
        });
        afterAll(() => {

        })
        it('Should render AuthPage', () => {
            const dataPage = page?.find(`main[data-test="authPage"]`);
            expect(dataPage?.length).toBe(1);
        });
    });
});
