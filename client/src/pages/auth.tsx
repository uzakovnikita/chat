import { FunctionComponent, useState } from 'react';
import { GetServerSideProps } from 'next'
import {isLogin} from '../serivces/ssrAuthService';

import useAuth from '../hooks/useAuth';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';



const AuthPage: FunctionComponent<{isLogin: boolean}> = (props) => {
    const [view, setView] = useState(false);
    useAuth(props.isLogin, '/rooms');

    return (
        <>
        {props.isLogin && <div></div>}
        {!props.isLogin && 
                <Flex width='100%' height='100%'>
                <Button onClick={() => setView((prevState) => !prevState)}>
                    Toggle button
                </Button>
                {view && <Login />}
                {!view && <Signup />}
            </Flex>
        }
        </>
    );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps =  async (context) => {
    const result = await isLogin(context);
    return {
        props: {
            isLogin: result.status,
        }
    }
}