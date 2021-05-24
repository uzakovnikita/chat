import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { theme } from './constants/theme';

import './index.css';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ContextAuth.Provider value={auth}>
            <ContextChat.Provider value={chat}>
                <ContextCommon.Provider value={common}>
                    <App />
                </ContextCommon.Provider>
            </ContextChat.Provider>
        </ContextAuth.Provider>
    </ThemeProvider>,
    document.getElementById('root'),
);
