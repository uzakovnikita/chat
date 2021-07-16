import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import { ThemeProvider } from 'styled-components';
import Auth from '../store/Auth';
import Chat from '../store/Chat';
import { ContextAuth, ContextChat, ContextErrorsLogs } from '../store/contexts';
import useInitStore from '../hooks/useInitStore';

import { theme } from '../constants/theme';
import '../styles/index.css';
import  ErrorsLogs  from '../store/ErrorsLogs';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
    NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({
    Component,
    pageProps,
}: {
    Component: any;
    pageProps: any;
}) {
    const authStore = useInitStore<Auth>(Auth, pageProps.initialAuthStore);
    const chatStore = useInitStore<Chat>(Chat, pageProps.initialChatStore);
    const errorsLogsStore = useInitStore<ErrorsLogs>(ErrorsLogs, pageProps.initialErrorsLogs);

    return (
        <>
            <ThemeProvider theme={theme}>
                <ContextAuth.Provider value={authStore}>
                    <ContextChat.Provider value={chatStore}>
                        <ContextErrorsLogs.Provider value={errorsLogsStore}>
                        <Head>
                            <link
                                rel='stylesheet'
                                type='text/css'
                                href='/nprogress.css'
                            />
                        </Head>
                        <Component {...pageProps} />
                        </ContextErrorsLogs.Provider>
                    </ContextChat.Provider>
                </ContextAuth.Provider>
            </ThemeProvider>
        </>
    );
}
