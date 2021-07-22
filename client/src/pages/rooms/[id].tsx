/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, FunctionComponent } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { api, startInterceptor } from '../../http/index';

import AuthService from '../../services/AuthService';
import MessagesService from '../../services/MessagesService';
import RoomsService from '../../services/RoomsService';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';

import NotificationContainer from '../../components/NotificationContainer';
import PrivateRoom from '../../components/containers/PrivateRoom';
import Main from '../../components/styledComponents/Main';

const PrivateRoomPage: FunctionComponent = () => {
    
    const chatStore = useChatContext();
    const authStore = useAuthContext();

    useAuth(!authStore.isLogin, '/auth');

    useEffect(() => {
        const axiosInstance = api();
        chatStore.audio = new Audio('/sounds/notify.mp3');
        if (authStore.isLogin) {
            startInterceptor(authStore.accessToken as string, axiosInstance);
            runInAction(() => {
                chatStore.connect(authStore.id as string);
                chatStore.listenAllRooms(authStore.id as string);
            });
        }
        return () => {
            runInAction(() => {
                chatStore.isFetchedMessage = false;
                chatStore.messages = [];
                chatStore.idCurrentPrivateRoom = null;
            });
        };
    }, []);

    return (
        <>
            <Head>
                <title>Private room</title>
            </Head>
            <Main className="private-room" data-test="privateRoomPage">
                <PrivateRoom />
            </Main>
            <NotificationContainer />
        </>
    );
};

export default observer(PrivateRoomPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const axiosInstance = api();

        const {
            data: { user },
        } = await AuthService.isLogin(axiosInstance, context);

        startInterceptor(user.accessToken, axiosInstance);

        const {
            data: { rooms },
        } = await RoomsService.getRooms(axiosInstance);

        const { id } = context.query;

        const {
            data: { messages },
        } = await MessagesService.getMessages(axiosInstance, id as string, 0);

        const room = rooms.find(({ roomId }) => roomId === id);

        return {
            props: {
                initialAuthStore: {
                    isLogin: true,
                    id: user.id,
                    email: user.email,
                    isHydrated: true,
                    accessToken: user.accessToken,
                },
                initialChatStore: {
                    messages,
                    rooms,
                    isFetchedMessage: true,
                    idCurrentPrivateRoom: room?.roomId,
                    interlocutorName: room!.interlocutorName,
                    interlocutorId: room!.interlocutorId,
                    isPrivateRoom: true,
                    isJoined: true,
                },
            },
        };
    } catch (err) {
        return {
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                    accessToken: null
                },
                initialErrorsLogs: [err.message],
            },
        };
    }
};
