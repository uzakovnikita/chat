import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next'
import {isLogin} from '../serivces/ssrPrefetchingService';

import useAuth from '../hooks/useAuth';

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
    const result = await isLogin(context);
    return {
        props: {
            isLogin: result.status,
        }
    }
}