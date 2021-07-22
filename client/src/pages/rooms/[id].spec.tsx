import PrivateRoomPage from './[id]';

import Auth from '../../store/Auth';
import ErrorsLogs from '../../store/ErrorsLogs';
import Chat from '../../store/Chat';

import prepareWrappForPage from '../../utils/prepareWrappForPage';
import socketService from '../../services/SocketService';
import {api, startInterceptor} from '../../http';

jest.mock('../../http');

const privateRoomSelector = 'main[data-test="privateRoomPage"]';

const fakeId = 'fakeId';
const fakeToken = 'fakeToken';
const fakeApi = 'fakeApi';


describe('rooms[id] page', () => {
    let chatStore: undefined | Chat,
        authStore: undefined | Auth,
        errorsLogsStore: undefined | ErrorsLogs,
        connect: undefined | jest.SpyInstance<void, [id: string]>,
        listenAllRooms:
            | undefined
            | jest.SpyInstance<void, [handleMessage: any]>;

    beforeAll(() => {
        chatStore = new Chat();
        authStore = new Auth();
        authStore.isLogin = true;
        authStore.isHydrated = true;
        errorsLogsStore = new ErrorsLogs();
        jest.spyOn(socketService, 'connect');
        listenAllRooms = jest.spyOn(chatStore, 'listenAllRooms');
        connect = jest.spyOn(chatStore, 'connect');
    });
    afterAll(() => {
        
    });

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('Should render rooms[id] page', () => {
        const page = prepareWrappForPage(PrivateRoomPage, {
            chatStore,
            authStore,
            errorsLogsStore,
        });


        const wrapper = page?.find(privateRoomSelector);

        expect(wrapper?.length).toBe(1);
        expect(1).toBe(1);
    });
    it('Should initialize store when component will mount', () => {
        authStore!.id = fakeId;
        authStore!.accessToken = fakeToken;
        (api as jest.Mock).mockImplementation(() => fakeApi);

        prepareWrappForPage(PrivateRoomPage, {
            chatStore,
            authStore,
            errorsLogsStore,
        });

        expect(chatStore?.audio instanceof Audio).toBeTruthy();
        expect(connect!.mock.calls[0][0]).toBe(fakeId);
        expect(listenAllRooms!.mock.calls[0][0]).toBe(fakeId);
        expect((startInterceptor as jest.Mock).mock.calls[0]).toEqual([
            fakeToken, fakeApi
        ]);
    });
    it('Should call function when component will unmount', () => {
        const page = prepareWrappForPage(PrivateRoomPage, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        page?.unmount();
        expect(chatStore?.isFetchedMessage).toBeFalsy();
        expect(chatStore?.messages).toEqual([]);
        expect(chatStore?.idCurrentPrivateRoom).toBeNull();
    });
});

// TODO
describe('getServerSideProps from rooms[id] page', () => {});
