import { FunctionComponent, useState } from 'react';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';

const AuthPage: FunctionComponent = (props) => {
    const [view, setView] = useState(false);
    console.log(props)
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
                    message: 'ok'
                }
            }
        }
    } catch (err) {
        return {
            props: {
                message: JSON.stringify(err, null, 2)
            }
        }
    }
    return {
        props: {
            message: JSON.stringify(response.status)
        }
    }
}