import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/dist/next-server/lib/head';
import { ThemeProvider } from 'styled-components';

import auth from '../store/auth';
import chat from '../store/chat';

import { ContextAuth, ContextChat } from '../store/contexts';

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
    return (
        <>
            <ThemeProvider theme={theme}>
                <ContextAuth.Provider value={auth}>
                    <ContextChat.Provider value={chat}>
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
