/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { startInterceptor, api } from '../../http/index';

import RoomsService from '../../services/RoomsService';
import MessagesService from '../../services/MessagesService';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';

import AuthService from '../../services/AuthService';

import Rooms from '../../components/containers/Rooms';
import NotificationContainer from '../../components/NotificationContainer';
import Main from '../../components/styledComponents/Main';

const RoomsPage: FunctionComponent = () => {
    const chatStore = useChatContext();
    const authStore = useAuthContext();
    useAuth(!authStore.isLogin, '/auth');

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
        if (authStore.isLogin) {
            chatStore.listenAllRooms(authStore.id as string);
            chatStore.connect(authStore.id as string);
        }
    }, []);

    return (
        <>
            {false && null}
            {!false && (
                <>
                    <Head>
                        <title>rooms</title>
                    </Head>
                    <Main className="rooms">{authStore.isLogin && <Rooms />}</Main>
                    <NotificationContainer />
                </>
            )}
        </>
    );
};

export default observer(RoomsPage);

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
        const roomsIds = rooms.map(({ roomId }) => roomId);
        const {
            data: { lastMessagesInRooms },
        } = await MessagesService.getLastMessagesInRooms(
            axiosInstance,
            roomsIds,
        );

        return {
            props: {
                initialAuthStore: {
                    id: user.id,
                    email: user.email,
                    isLogin: true,
                    accessToken: user.accessToken,
                    isHydrated: true,
                },
                initialChatStore: {
                    rooms,
                    lastMessagesInRooms,
                },
            },
        };
    } catch (err) {
        return {
            props: {
                initialAuthStore: {
                    isHydrated: true,
                },
                initialChatStore: {},
                initialErrorsLogs: JSON.stringify(err),
            },
        };
    }
};
