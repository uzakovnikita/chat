import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next'

import useAuth from '../hooks/useAuth';
import AuthService from '../services/AuthService';
import { api } from '../http';

const IndexPage: FunctionComponent<{isLogin: boolean}> = (props) => {
    useAuth(props.isLogin, '/rooms');
    useAuth(!props.isLogin, '/auth');
    return (
        <>
        </>
    );
};

export default IndexPage;

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