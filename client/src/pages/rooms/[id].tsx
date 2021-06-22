import { useEffect, FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { observer } from 'mobx-react-lite';

import { isLogin, fetchMessages, fetchDialogs } from '../../serivces/ssrPrefetchingService';
import AuthService from '../../serivces/AuthService';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import { startInterceptor } from '../../http/index';

import PrivateRoom from '../../components/PrivateRoom';

import { Chat } from '../../store/chat';
import { message, room } from '../../constants/types';
import { runInAction } from 'mobx';

type Props = {
    messages: message[],
    isLogin: boolean,
    user: null | {
        message: string,
        user: {
            email: string,
            id: string,
            isActivated: boolean,
            accessToken: string,
        }
    },
    room: room | null,
}

const PrivateRoomPage: FunctionComponent<Props> = (props) => {
    useAuth(!props.isLogin, '/auth');
    console.log(props)
    const { messages, user } = props;
    const chatStore = useChatContext() as Chat;

    if (props.isLogin) startInterceptor(user!.user.accessToken);
    useEffect(() => {
        if (props.isLogin) {
            AuthService.refresh();
            chatStore.messages = messages;
        }
        if (!chatStore.isSsrGidrated) {
            chatStore.join(props.room!.roomId, props.room!.interlocutorName, props.room!.interlocutorId, props.user!.user.id);
        }
    }, []);
    return (
        <>
            <Head>
                <title>Private room</title>
            </Head>
            <PrivateRoom />
        </>
    );
};

export default observer(PrivateRoomPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { status, user } = await isLogin(context);
    const { id } = context.query;

    if (status) {
        const messages = await fetchMessages(user.user.accessToken, id as string);
        const {dialogs} = await fetchDialogs(user.user.accessToken);
        const room = dialogs.find(({roomId}) => roomId === id);
        return {
            props: {
                isLogin: status,
                user,
                ...messages,
                room
            }
        }
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
