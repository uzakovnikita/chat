import { FunctionComponent, useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';

const AuthPage: FunctionComponent<{status: boolean}> = (props) => {
    const [view, setView] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (props.status) {
            router.push('/');
        }
    }, [])

    return (
        <Flex width='100%' height='100%'>
            <Button onClick={() => setView((prevState) => !prevState)}>
                Toggle button
            </Button>
            {view && <Login />}
            {!view && <Signup />}
        </Flex>
    );
};

export default AuthPage;

export async function getServerSideProps () {
    let response;
    try {
        response = await fetch('http://localhost:1000/api/auth/refresh');
        if (response.ok) {
            return {
                props: {
                    status: true
                }
            }
        } else {
            return {
                props: {
                    status: false
                }
            }
        }
    } catch (err) {
        return {
            props: {
                status: false
            }
        }
    }
}