/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, FunctionComponent } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { startInterceptor, api } from '../../http/index';

import DialogService from '../../serivces/DialogsService';
import MessagesService from '../../serivces/MessagesService';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';
import useError from '../../hooks/useError';

import AuthService from '../../serivces/AuthService';

import Rooms from '../../components/containers/Rooms';
import NotificationContainer from '../../components/NotificationContainer';
import Main from '../../components/styledComponents/Main';

import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { message, room } from '../../constants/types';


type Props = {
    dialogs: {
        roomId: string;
        interlocutorName: string;
        interlocutorId: string;
    }[];
    isLogin: boolean;
    lastMessagesInRooms: { messages: message[] };
    user: {
        email: string;
        id: string;
        isActivated: boolean;
        accessToken: string;
    } | null;
    error?: any;
};

const RoomsPage: FunctionComponent<Props> = (props) => {
    const { dialogs, user, isLogin, lastMessagesInRooms, error } = props;

    useError(props.error);
    useAuth(!props.isLogin, '/auth');

    const trueDialogs: room[] = dialogs;
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;

    useEffect(() => {
        const axiosInstance = api();
        
        chatStore.setRooms = trueDialogs;
        chatStore.connect(authStore.id as string);

        if (isLogin) {
            authStore.id = user!.id;
            authStore.email = user!.email;
            startInterceptor(user!.accessToken, axiosInstance);
            AuthService.refresh(axiosInstance);
            runInAction(() => {
                lastMessagesInRooms.messages.forEach((message) => {
                    const { room } = message;
                    chatStore.lastMessagesInEachRooms[room] = message;
                });
            });
            chatStore.listenAllRooms(user!.id);
        }
    }, []);

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
    }, []);

    return (
        <>
            {error && null}
            {!error && (
                <>
                    <Head>
                        <title>rooms</title>
                    </Head>
                    <Main>{isLogin && <Rooms />}</Main>
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
            data: { dialogs },
        } = await DialogService.getDialogs(axiosInstance);
    
        const rooms = dialogs.map(({ roomId }) => roomId);
        const lastMessagesInRooms = await MessagesService.getLastMessagesInRooms(axiosInstance, rooms);
    
        return {
            props: {
                user,
                dialogs,
                lastMessagesInRooms: lastMessagesInRooms.data,
                error: null,
                isLogin: true,
            },
        };
    }

     catch (err) {
        return {
            props: {
                isLogin: false,
                user: null,
                dialogs: [],
                lastMessageInRooms: [],
                error: JSON.stringify(err),
            },
        };
    }
};
