/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { observer } from 'mobx-react-lite';

import {
    isLogin,
    fetchMessages,
    fetchDialogs,
} from '../../serivces/ssrPrefetchingService';
import AuthService from '../../serivces/AuthService';
import { startInterceptor } from '../../http/index';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';

import Head from 'next/head';
import PrivateRoom from '../../components/PrivateRoom';
import Main from '../../components/styledComponents/Main';

import { Chat } from '../../store/chat';
import { message, room } from '../../constants/types';
import useAuthContext from '../../hooks/useAuthContext';
import { Auth } from '../../store/auth';
import { runInAction } from 'mobx';
import NotificationContainer from '../../components/NotificationContainer';

type Props = {
    messages: message[];
    isLogin: boolean;
    user: null | {
        message: string;
        user: {
            email: string;
            id: string;
            isActivated: boolean;
            accessToken: string;
        };
    };
    room: room | null;
    dialogs: {
        roomId: string;
        interlocutorName: string;
        interlocutorId: string;
    }[];
};

const PrivateRoomPage: FunctionComponent<Props> = (props) => {
    useAuth(!props.isLogin, '/auth');

    const { messages, user } = props;
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;

    if (props.isLogin) startInterceptor(user!.user.accessToken);

    useEffect(() => {
        if (props.isLogin) {
            AuthService.refresh();
            runInAction(() => {
                chatStore.isFetchedMessage = true;
                chatStore.messages = messages;
                chatStore.connect(props.user!.user.id);
                chatStore.setRooms = props.dialogs;
                chatStore.listenAllRooms(props.user!.user.id);
                chatStore.join(
                    props.room!.roomId,
                    props.room!.interlocutorName,
                    props.room!.interlocutorId,
                );
                authStore.id = props.user!.user.id;
                authStore.email = props.user!.user.email;
                authStore.accessToken = props.user!.user.accessToken;
            });
        }
        return () => {
            runInAction(() => {
                chatStore.isFetchedMessage = false;
                chatStore.messages = [];
                chatStore.idCurrentPrivateRoom = null;
            })
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
            <NotificationContainer/>
        </>
    );
};

export default observer(PrivateRoomPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { status, user } = await isLogin(context);
    const { id } = context.query;

    if (status) {
        const messages = await fetchMessages(
            user.user.accessToken,
            id as string,
        );
        const { dialogs } = await fetchDialogs(user.user.accessToken);
        const room = dialogs.find(({ roomId }) => roomId === id);
        return {
            props: {
                isLogin: status,
                user,
                ...messages,
                room,
                dialogs,
            },
        };
    }
    return {
        props: {
            isLogin: status,
            user,
            messages: [],
            room: null,
        },
    };
};
