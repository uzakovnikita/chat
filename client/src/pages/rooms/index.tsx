/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';


import { Chat } from '../../store/chat';

import useAuth from '../../hooks/useAuth';
import useChatContext from '../../hooks/useChatContext';
import useAuthContext from '../../hooks/useAuthContext';

import { isLogin, fetchDialogs } from '../../serivces/ssrPrefetchingService';
import AuthService from '../../serivces/AuthService';
import { startInterceptor } from '../../http/index';

import Rooms from '../../components/Rooms';
import Main from '../../components/styledComponents/Main';

import { room } from '../../constants/types';
import { Auth } from '../../store/auth';

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
            AuthService.refresh();
        }
        
    }, []);

    useEffect(() => {
        chatStore.audio = new Audio('/sounds/notify.mp3');
    }, [])

    return (
        <Main>  
            <Head>
                <title>rooms</title>
            </Head>
            {props.isLogin && <Rooms />}
        </Main>
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