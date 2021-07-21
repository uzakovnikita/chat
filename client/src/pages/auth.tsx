import { FunctionComponent, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { api } from '../http';

import AuthService from '../services/AuthService';

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
        <>
            <Head>
                <title>Auth</title>
            </Head>
            <Main data-test="authPage">
                {authStore.isLogin && null}
                {!authStore.isLogin && (
                    <Flex width='100%' height='100%' data-test="authPageContent">
                        <Button
                            onClick={() => setView((prevState) => !prevState)}
                            data-test="toggleButton"
                        >
                            Switch login/signup
                        </Button>
                        {view && <Login data-test="loginComponent"/>}
                        {!view && <Signup data-test="signupComponent"/>}
                    </Flex>
                )}
                <Error />
            </Main>
        </>
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
            },
        };
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
                    },
                },
            };
        }
        return {
            props: {
                initialAuthStore: {
                    isLogin: false,
                    isHydrated: true,
                },
                initialErrorsLogs: {
                    errors: [err.message],
                },
            },
        };
    }
};
