import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { Chat } from '../../store/chat';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';

import { isLogin, fetchDialogs } from '../../serivces/ssrPrefetchingService';
import AuthService from '../../serivces/AuthService';
import { startInterceptor } from '../../http/index';

import Rooms from '../../components/Rooms';

import { room } from '../../constants/types';
import { useEffect } from 'react';

type Props = {
    dialogs: {
        message: string,
        dialogs: {
            roomId: string,
            interlocutorName: string,
            interlocutorId: string,
        }[]
    },
    isLogin: boolean,
    user: null | {
        message: string,
        user: {
            email: string,
            id: string,
            isActivated: boolean,
            accessToken: string,
        }
    }
}

const RoomsPage: FunctionComponent<Props> = (props) => {
    useAuth(!props.isLogin, '/auth');
    console.log(props)
    const { dialogs, user } = props;
    const trueDialogs: room[] = dialogs.dialogs;
    const chatStore = useChatContext() as Chat;
    
    if (props.isLogin) startInterceptor(user!.user.accessToken);
    useEffect(() => {
        chatStore.setRooms = trueDialogs;
        chatStore.isSsrGidrated = true;
        if (props.isLogin) {
            AuthService.refresh();
        }
    }, []);
    return (
        <>  
            <Head>
                <title>rooms</title>
            </Head>
            {props.isLogin && <Rooms />}

        </>
    );
};

export default observer(RoomsPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { status, user } = await isLogin(context);
    if (status) {
        const dialogs = await fetchDialogs(user.user.accessToken);
        return {
            props: {
                isLogin: status,
                user,
                dialogs
            }
        }
    }
    return {
        props: {
            isLogin: status,
            user,
            dialogs: []
        },
    };
};
