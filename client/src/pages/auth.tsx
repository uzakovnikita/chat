import { FunctionComponent, useState } from 'react';
import { GetServerSideProps } from 'next'

import useAuth from '../hooks/useAuth';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';
import Main from '../components/styledComponents/Main';
import { api } from '../http';
import AuthService from '../serivces/AuthService';


const AuthPage: FunctionComponent<{isLogin: boolean}> = (props) => {
    const [view, setView] = useState(false);
    useAuth(props.isLogin, '/rooms');

    return (
        <Main>
        {props.isLogin && <div></div>}
        {!props.isLogin && 
                <Flex width='100%' height='100%'>
                <Button onClick={() => setView((prevState) => !prevState)}>
                    Switch login/signup
                </Button>
                {view && <Login />}
                {!view && <Signup />}
            </Flex>
        }
        </Main>
    );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps =  async (context) => {
    const instanceAxios = api();
    try {
        await AuthService.isLogin(instanceAxios, context);
        return {
            props: {
                isLogin: true,
            }
        }
    } catch (err) {
        return {
            props: {
                isLogin: false
            }
        }
    }
}