import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import { ThemeProvider } from 'styled-components';
import { Auth } from '../store/auth';
import { Chat } from '../store/chat';
import { ContextAuth, ContextChat } from '../store/contexts';
import useInitStore from '../hooks/useInitStore';

import { theme } from '../constants/theme';

import '../styles/index.css';

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
    return (
        <>
            <ThemeProvider theme={theme}>
                <ContextAuth.Provider value={authStore}>
                    <ContextChat.Provider value={chatStore}>
                        <Head>
                            <link
                                rel='stylesheet'
                                type='text/css'
                                href='/nprogress.css'
                            />
                        </Head>
                        <Component {...pageProps} />
                    </ContextChat.Provider>
                </ContextAuth.Provider>
            </ThemeProvider>
        </>
    );
}
