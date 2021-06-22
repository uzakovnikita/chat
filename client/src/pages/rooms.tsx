import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { isLogin, fetchDialogs } from '../serivces/ssrAuthService';
import useAuth from '../hooks/useAuth';

import Rooms from '../components/Rooms';
import { URLS } from '../constants/enums';
import { observer } from 'mobx-react-lite';
import useChatContext from '../hooks/useChatContext';



const RoomsPage: FunctionComponent<any> = (props) => {
    useAuth(!props.isLogin, '/auth');
    console.log(props);
    const {dialogs} = props;
    const trueDialogs = dialogs.dialogs;
    const chatStore = useChatContext();
    return (
        <>  
            <Rooms/>
        </>
    );
};

export default observer(RoomsPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {status, user} = await isLogin(context);
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
