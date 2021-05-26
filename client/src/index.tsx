import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { theme } from './constants/theme';

import './index.css';
import auth from './store/auth';
import chat from './store/chat';
import { ContextAuth, ContextChat } from './store/contexts';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ContextAuth.Provider value={auth}>
            <ContextChat.Provider value={chat}>
                    <App />
            </ContextChat.Provider>
        </ContextAuth.Provider>
    </ThemeProvider>,
    document.getElementById('root'),
);
