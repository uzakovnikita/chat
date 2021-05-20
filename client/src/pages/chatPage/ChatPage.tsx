import { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import auth from '../../store/auth';
import common from '../../store/common';
import chat from '../../store/chat';
import { ContextChat, ContextCommon, ContextAuth } from '../../store/contexts';

import Users from '../../components/Users';
import PrivateRoom from '../../components/PrivateRoom';
import Button from '../../components/styledComponents/Button';

const ChatPage: FunctionComponent = () => {
    useEffect(() => {
        try {
            console.log(auth.id);
            common.connect(auth.id);
            common.getUsers();
        } catch (err) {
            common.registrError(String(err));
        }
    }, []);
    const handleBack = () => {
        chat.leave();
    };
    return (
        <>
            {chat.isPrivateRoom && (
                <ContextAuth.Provider value={auth}>
                    <ContextChat.Provider value={chat}>
                        <ContextCommon.Provider value={common}>
                            <Button align={'flex-start'} isNotCentrAlign={true} onClick={handleBack}>Назад</Button>
                            <PrivateRoom />
                        </ContextCommon.Provider>
                    </ContextChat.Provider>
                </ContextAuth.Provider>
            )}
            {!chat.isPrivateRoom && <Users />}
        </>
    );
};

export default observer(ChatPage);
