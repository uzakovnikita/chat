import { FunctionComponent, useState } from 'react';
import { GetServerSideProps } from 'next'

import { api } from '../http';

import AuthService from '../serivces/AuthService';

import useAuth from '../hooks/useAuth';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';
import Main from '../components/styledComponents/Main';
import useAuthContext from '../hooks/useAuthContext';
import Error from '../components/containers/Error';

const AuthPage: FunctionComponent = () => {
    const authStore = useAuthContext();

    const [view, setView] = useState(false);
    useAuth(authStore.isLogin, '/rooms');

    return (
        <Main>
        {authStore.isLogin && null}
        {!authStore.isLogin && 
                <Flex width='100%' height='100%'>
                <Button onClick={() => setView((prevState) => !prevState)}>
                    Switch login/signup
                </Button>
                {view && <Login />}
                {!view && <Signup />}
            </Flex>
        }
        <Error/>
        </Main>
    );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const instanceAxios = api();
    try {
        await AuthService.isLogin(instanceAxios, context);
        return {
            props: {
                initialAuthStore: {
                    isLogin: true,
                    isHydrated: true,
                },
            }
        }
    } catch (err) {
        if (err.message.match(/401/gm)) {
            return {
                props: {
                    initialAuthStore: {
                        isLogin: false,
                        isHydrated: true,
                    },
                    initialErrorsLogs: {
                        errors: [],
                    }
                }
            }
        }
        return {
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                },
                initialErrorsLogs: {
                    errors: [JSON.stringify(err)],
                }
            }
        }
    }
}