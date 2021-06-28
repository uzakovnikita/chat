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
                chatStore.messages = messages;
                chatStore.connect(props.user!.user.id);
                chatStore.join(
                    props.room!.roomId,
                    props.room!.interlocutorName,
                    props.room!.interlocutorId,
                    props.user!.user.id,
                );
                chatStore.isFetchedMessage = true;
                authStore.id = props.user!.user.id;
                authStore.accessToken = props.user!.user.accessToken;
            })
        }
        return () => {
            chatStore.leave();
            chatStore.isFetchedMessage = false;
        };
    }, []);

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
    }, []);

    return (
        <>
            <Head>
                <title>Private room</title>
            </Head>
            <Main>
                <PrivateRoom/>
            </Main>
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
