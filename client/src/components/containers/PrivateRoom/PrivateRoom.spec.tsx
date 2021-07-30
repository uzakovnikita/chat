import { render, screen, wait } from '@testing-library/react';
import '@testing-library/jest-dom';

import PrivateRoom from '.';

import Auth from '../../../store/Auth';
import Chat from '../../../store/Chat';

import ErrorsLogs from '../../../store/ErrorsLogs';
import prepareWrappForPage from '../../../utils/prepareWrappForPage';
import { ARIA_NAMES } from '../../../constants/enums';

const privateRoomRegExp = /PrivateRoom/;
const fakeName = 'fakeName';

describe('PrivateRoom test with RTL', () => {
    const chatStore = new Chat();
    chatStore.interlocutorName = fakeName;
    const authStore = new Auth();
    const errorsLogsStore = new ErrorsLogs();

    it('Should render PrivateRoom', async () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const privateRoomComponent = screen.getByRole('form');
        expect(privateRoomComponent).toBeInTheDocument();
        const nameOfRoom = screen.getByRole('heading');
        expect(nameOfRoom).toHaveTextContent(fakeName);
    });
    it('Should type text in message input', () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const input = screen.getByRole('textbox');
    })
});
