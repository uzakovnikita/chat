import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import PrivateRoom from '.';

import Auth from '../../../store/Auth';
import Chat from '../../../store/Chat';

import ErrorsLogs from '../../../store/ErrorsLogs';
import prepareWrappForPage from '../../../utils/prepareWrappForPage';
import { ARIA_NAMES } from '../../../constants/enums';

const privateRoomRegExp = /PrivateRoom/;

describe('PrivateRoom test with RTL', () => {
    const chatStore = new Chat();
    const authStore = new Auth();
    const errorsLogsStore = new ErrorsLogs();

    it('Should render PrivateRoom', () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const privateRoomComponent = screen.getByRole('form', {name: ARIA_NAMES.MESSAGE_FORM});
        expect(privateRoomComponent).toBeInTheDocument();
    });
});

describe('PrivateRoom test with RTL, FSM-hook', () => {
    it('Should fire event init', () => {
        
    });
})
