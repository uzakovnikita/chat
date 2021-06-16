import { ThemeProvider } from 'styled-components';
import auth from '../store/auth';
import chat from '../store/chat';
import { ContextAuth, ContextChat } from '../store/contexts';
import { theme } from '../constants/theme';

export default function App({ Component, pageProps }: {Component: any, pageProps: any}) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <ContextAuth.Provider value={auth}>
                    <ContextChat.Provider value={chat}>
                        <Component {...pageProps} />
                    </ContextChat.Provider>
                </ContextAuth.Provider>
            </ThemeProvider>
        </>
    );
}
