import PrivateRoomPage from './[id]';

import Auth from '../../store/Auth';
import ErrorsLogs from '../../store/ErrorsLogs';
import Chat from '../../store/Chat';

import prepareWrappForPage from '../../utils/prepareWrappForPage';
import socketService from '../../services/SocketService';

const privateRoomSelector = 'main[data-test="privateRoomPage"]';

describe('rooms[id] page', () => {
    let chatStore: undefined |Chat,
        authStore: undefined | Auth,
        errorsLogsStore: undefined | ErrorsLogs;

    beforeAll(() => {
        chatStore = new Chat();
        authStore = new Auth();
        authStore.isLogin = true;
        authStore.isHydrated = true;
        errorsLogsStore = new ErrorsLogs();
        jest.spyOn(socketService, 'connect')
    });
    afterAll(() => {
    })
    it('Should render rooms[id] page', () => {
        const page = prepareWrappForPage(PrivateRoomPage, { chatStore, authStore, errorsLogsStore });
        const wrapper = page?.find(privateRoomSelector);
        expect(wrapper?.length).toBe(1);
        expect(1).toBe(1);
    });
    it('Should initialize store when component will mount', () => {
        const page = prepareWrappForPage(PrivateRoomPage, { chatStore, authStore, errorsLogsStore });
        expect(!!chatStore?.audio).toBeTruthy();
    });
    it('Should call function when component will unmount', () => {
        const page = prepareWrappForPage(PrivateRoomPage, { chatStore, authStore, errorsLogsStore });
        page?.unmount();
        expect(chatStore?.isFetchedMessage).toBeFalsy();
        expect(chatStore?.messages).toEqual([]);
        expect(chatStore?.idCurrentPrivateRoom).toBeNull();
    });
});