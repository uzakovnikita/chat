import { mount, ReactWrapper } from 'enzyme';
import { ThemeProvider } from 'styled-components';

import { ContextAuth, ContextErrorsLogs, ContextChat } from '../store/contexts';
import { theme } from '../constants/theme';
import Auth from '../store/Auth';
import Chat from '../store/Chat';
import ErrorsLogs from '../store/ErrorsLogs';
import { Component, FunctionComponent } from 'react';

type args = Partial<{
    authStore: Auth;
    chatStore: Chat;
    errorsLogsStore: ErrorsLogs;
}>;

const prepareWrappForPage: (
    Page: FunctionComponent,
    store: args,
) => ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>> | undefined = (
    Page,
    { authStore, chatStore, errorsLogsStore },
) => {
    return mount(
        <ThemeProvider theme={theme}>
            <ContextAuth.Provider value={authStore}>
                <ContextChat.Provider value={chatStore}>
                    <ContextErrorsLogs.Provider value={errorsLogsStore}>
                        <Page />
                    </ContextErrorsLogs.Provider>
                </ContextChat.Provider>
            </ContextAuth.Provider>
        </ThemeProvider>,
    );
};

export default prepareWrappForPage;
