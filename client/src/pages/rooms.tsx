import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { isLogin } from '../serivces/ssrAuthService';
import useAuth from '../hooks/useAuth';

import Rooms from '../components/Rooms';
import { URLS } from '../constants/enums';



const RoomsPage: FunctionComponent<any> = (props) => {
    useAuth(!props.isLogin, '/auth');
    console.log(props)
    return (
        <>  
            <Rooms />
        </>
    );
};

export default RoomsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {status, user} = await isLogin(context);
    if (status) {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${user.user.accessToken}`)
        const dialogs = await fetch(URLS.Rooms, {
            method: 'POST',
            headers: myHeaders,
        }).then((result) => result.json());
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
        },
    };
};
