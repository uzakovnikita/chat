/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import chat, { Chat } from '../../store/chat';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';

import {
    isLogin,
    fetchDialogs,
    fetchLastMessagesInRooms,
} from '../../serivces/ssrPrefetchingService';
import AuthService from '../../serivces/AuthService';
import { startInterceptor } from '../../http/index';

import Rooms from '../../components/Rooms';
import NotificationContainer from '../../components/NotificationContainer';
import Main from '../../components/styledComponents/Main';

import { message, room } from '../../constants/types';
import { Auth } from '../../store/auth';
import { runInAction } from 'mobx';

type Props = {
    dialogs: {
        message: string;
        dialogs: {
            roomId: string;
            interlocutorName: string;
            interlocutorId: string;
        }[];
    };
    isLogin: boolean;
    lastMessagesInRooms: { messages: message[] };
    user: null | {
        message: string;
        user: {
            email: string;
            id: string;
            isActivated: boolean;
            accessToken: string;
        };
    };
};

const RoomsPage: FunctionComponent<Props> = (props) => {
    useAuth(!props.isLogin, '/auth');

    const { dialogs, user } = props;
    const trueDialogs: room[] = dialogs.dialogs;
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;

    if (props.isLogin) startInterceptor(user!.user.accessToken);

    useEffect(() => {
        chatStore.setRooms = trueDialogs;
        chatStore.connect(authStore.id as string);
        if (props.isLogin) {
            authStore.id = user!.user.id;
            authStore.email = user!.user.email;
            AuthService.refresh();
            runInAction(() => {
                props.lastMessagesInRooms.messages.forEach((message) => {
                    const { room } = message;
                    chatStore.lastMessagesInEachRooms[room] = message;
                    console.log(chatStore.lastMessagesInEachRooms[room]);
                });
            });
            chat.listenAllRooms(user!.user.id);
        }
    }, []);

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
    }, []);
    return (
        <>
            <Head>
                <title>rooms</title>
            </Head>
            <Main>
                {props.isLogin && <Rooms />}
            </Main>
            <NotificationContainer/>
        </>
    );
};

export default observer(RoomsPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { status, user } = await isLogin(context);
    if (status) {
        const dialogs = await fetchDialogs(user.user.accessToken);
        const rooms = dialogs.dialogs.map(({ roomId }) => roomId);
        const lastMessagesInRooms = await fetchLastMessagesInRooms(
            user.user.accessToken,
            rooms,
        );
        return {
            props: {
                isLogin: status,
                user,
                dialogs,
                lastMessagesInRooms,
            },
        };
    }
    return {
        props: {
            isLogin: status,
            user,
            dialogs: [],
        },
    };
};
