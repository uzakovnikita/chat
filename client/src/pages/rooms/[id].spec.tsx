import PrivateRoomPage from './[id]';
import { getServerSideProps } from './[id]';

import genFakeContext from '../../__fixtures__/genFakeContext';

import Auth from '../../store/Auth';
import ErrorsLogs from '../../store/ErrorsLogs';
import Chat from '../../store/Chat';

import wrappAndMountPage from '../../utils/wrappAndMountPage';

// mocked modules
import { api, startInterceptor } from '../../http';
import AuthService from '../../services/AuthService';
import RoomsService from '../../services/RoomsService';
import MessagesService from '../../services/MessagesService';
import socketService from '../../services/SocketService';

const privateRoomSelector = 'main[data-test="privateRoomPage"]';

const fakeId = 'fakeId';
const fakeToken = 'fakeToken';
const fakeApi = 'fakeApi';
const fakeEmail = 'fakeEmail';
const fakeName = 'fakeName';
const fakeCookie = 'fakeCookie';
const fakeContext = genFakeContext({fakeCookie, fakeId});

const fakeMessages = ['message1', 'message2', 'message3'];

const fakeUser = {
    id: fakeId,
    email: fakeEmail,
    accessToken: fakeToken,
};
const fakeRoom = {
    roomId: fakeId,
    interlocutorName: fakeName,
    interlocutorId: fakeId,
};

const fakeRooms = [fakeRoom, fakeRoom];

jest.mock('../../hooks/useAuth');

jest.mock('../../http');
jest.mock('../../services/AuthService');
jest.mock('../../services/RoomsService');
jest.mock('../../services/MessagesService');


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

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('Should render rooms[id] page', () => {
        const page = wrappAndMountPage(PrivateRoomPage, {
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

        wrappAndMountPage(PrivateRoomPage, {
            chatStore,
            authStore,
            errorsLogsStore,
        });

        expect(chatStore?.audio instanceof Audio).toBeTruthy();
        expect(connect!.mock.calls[0][0]).toBe(fakeId);
        expect(listenAllRooms!.mock.calls[0][0]).toBe(fakeId);
        expect((startInterceptor as jest.Mock).mock.calls[0]).toEqual([
            fakeToken,
            fakeApi,
        ]);
    });
    it('Should initialize store when component will mount and user in not login', () => {
        authStore!.isLogin = false;
        wrappAndMountPage(PrivateRoomPage, {
            chatStore,
            authStore,
            errorsLogsStore
        });
        expect(connect!.mock.calls.length).toBe(0);
        expect(listenAllRooms!.mock.calls.length).toBe(0);
        expect((startInterceptor as jest.Mock).mock.calls.length).toBe(1);
        
    });
    it('Should call function when component will unmount', () => {
        const page = wrappAndMountPage(PrivateRoomPage, {
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

describe('getServerSideProps from rooms[id] page', () => {
    beforeAll(() => {
        (AuthService.isLogin as jest.Mock) = jest.fn().mockResolvedValue({
            data: {
                user: fakeUser,
            },
        });
        
        (MessagesService.getMessages as jest.Mock) = jest.fn().mockResolvedValue({
            data: {
                messages: fakeMessages,
            },
        });
        
        (RoomsService.getRooms as jest.Mock) = jest.fn().mockResolvedValue({
            data: {
                rooms: fakeRooms,
            },
        });
    });
    it('Should return props when user is login', async () => {
        const expected = {
            props: {
                initialAuthStore: {
                    isLogin: true,
                    id: fakeUser.id,
                    email: fakeUser.email,
                    isHydrated: true,
                    accessToken: fakeUser.accessToken,
                },
                initialChatStore: {
                    messages: fakeMessages,
                    rooms: fakeRooms,
                    isFetchedMessage: true,
                    idCurrentPrivateRoom: fakeRoom.roomId,
                    interlocutorName: fakeRoom.interlocutorName,
                    interlocutorId: fakeRoom.interlocutorId,
                    isPrivateRoom: true,
                    isJoined: true,
                },
            },
        };
        expect(await getServerSideProps(fakeContext)).toEqual(expected);
    });
    it('Should return props with error', async () => {
        const errorMessage = 'fakeError';
        const expected = {
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                    accessToken: null
                },
                initialErrorsLogs: [errorMessage],
            },
        }
        AuthService.isLogin = jest.fn().mockRejectedValue(new Error(errorMessage));
        expect(await getServerSideProps(fakeContext)).toEqual(expected);
    });
});
