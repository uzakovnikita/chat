import { FunctionComponent, useState } from 'react';

import Login from '../components/Login';
import Signup from '../components/Signup';
import Button from '../components/styledComponents/Button';
import Flex from '../components/styledComponents/Flex';

const AuthPage: FunctionComponent = () => {
    const [view, setView] = useState(false);
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
