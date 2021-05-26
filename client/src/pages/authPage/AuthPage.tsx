import { FunctionComponent, useState } from 'react';

import Login from '../../components/Login';
import Signup from '../../components/Signup';
import Button from '../../components/styledComponents/Button';
import Flex from '../../components/styledComponents/Flex';

import auth from '../../store/auth';
import common from '../../store/chat';
import chat from '../../store/chat_';

import { ContextChat, ContextCommon, ContextAuth } from '../../store/contexts';

const AuthPage: FunctionComponent = () => {
    const [view, setView] = useState(false);
    return (
        <Flex width='100%' height='100%'>
            <Button onClick={() => setView((prevState) => !prevState)}>
                Toggle button
            </Button>
            {view && (
                <ContextChat.Provider value={chat}>
                    <ContextCommon.Provider value={common}>
                        <ContextAuth.Provider value={auth}>
                            <Login />
                        </ContextAuth.Provider>
                    </ContextCommon.Provider>
                </ContextChat.Provider>
            )}
            {!view && <Signup />}
        </Flex>
    );
};

export default AuthPage;
