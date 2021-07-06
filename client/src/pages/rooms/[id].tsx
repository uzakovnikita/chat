/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, FunctionComponent } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { api, startInterceptor } from '../../http/index';

import AuthService from '../../serivces/AuthService';
import MessagesService from '../../serivces/MessagesService';
import DialogService from '../../serivces/DialogsService';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';

import NotificationContainer from '../../components/NotificationContainer';
import PrivateRoom from '../../components/containers/PrivateRoom';
import Main from '../../components/styledComponents/Main';

import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { message, room } from '../../constants/types';

type Props = {
    messages: message[];
    isLogin: boolean;
    user: {
        email: string;
        id: string;
        isActivated: boolean;
        accessToken: string;
    } | null;

    room: room | null;
    dialogs: {
        roomId: string;
        interlocutorName: string;
        interlocutorId: string;
    }[];
};

const PrivateRoomPage: FunctionComponent<Props> = (props) => {
    const { messages, user, dialogs, isLogin, room } = props;
    
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;

    useAuth(isLogin, '/auth');

    useEffect(() => {
        const axiosInstance = api();
        if (isLogin) {
            startInterceptor(user!.accessToken, axiosInstance);
            AuthService.refresh(axiosInstance);
            runInAction(() => {
                chatStore.isFetchedMessage = true;
                chatStore.messages = messages;
                chatStore.connect(user!.id);
                chatStore.setRooms = dialogs;
                chatStore.listenAllRooms(user!.id);
                chatStore.join(
                    room!.roomId,
                    room!.interlocutorName,
                    room!.interlocutorId,
                );
                authStore.id = user!.id;
                authStore.email = user!.email;
                authStore.accessToken = user!.accessToken;
            });
        }
        return () => {
            runInAction(() => {
                chatStore.isFetchedMessage = false;
                chatStore.messages = [];
                chatStore.idCurrentPrivateRoom = null;
            });
        };
    }, [props]);

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
    }, []);

    return (
        <>
            <Head>
                <title>Private room</title>
            </Head>
            <Main>
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
            data: { dialogs },
        } = await DialogService.getDialogs(axiosInstance);

        const { id } = context.query;
        const {
            data: { messages },
        } = await MessagesService.getMessages(axiosInstance, id as string, 0);

        const room = dialogs.find(({ roomId }) => roomId === id);
        return {
            props: {
                isLogin: true,
                user,
                messages,
                room, 
                dialogs
            },
        };
    } catch (err) {
        return {
            props: {
                isLogin: false,
                user: null,
                messages: [],
                room: null,
            },
        };
    }
};
