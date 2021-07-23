import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ContextAuth, ContextErrorsLogs, ContextChat } from '../store/contexts';

import Auth from '../store/Auth';
import Chat from '../store/Chat';
import ErrorsLogs from '../store/ErrorsLogs';

import { theme } from '../constants/theme';

type store = Partial<{
    authStore: Auth;
    chatStore: Chat;
    errorsLogsStore: ErrorsLogs;
}>;

const prepareWrappForPage = (
    Page: React.FunctionComponent,
    { authStore, chatStore, errorsLogsStore }: store,
) => {
    return (
        <ThemeProvider theme={theme}>
            <ContextAuth.Provider value={authStore}>
                <ContextChat.Provider value={chatStore}>
                    <ContextErrorsLogs.Provider value={errorsLogsStore}>
                        <Page />
                    </ContextErrorsLogs.Provider>
                </ContextChat.Provider>
            </ContextAuth.Provider>
        </ThemeProvider>
    );
};

export default prepareWrappForPage;
