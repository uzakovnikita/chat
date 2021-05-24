import { useContext, useEffect } from 'react';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import auth from '../../store/auth';
import common from '../../store/sockets';
import chat from '../../store/chat';
import { ContextChat, ContextCommon, ContextAuth } from '../../store/contexts';

import Users from '../../components/Rooms';
import PrivateRoom from '../../components/PrivateRoom';
import Button from '../../components/styledComponents/Button';

const ChatPage: FunctionComponent = () => {
    useEffect(() => {
        try {
            console.log(auth.id);
            common.connect(auth.id);
        } catch (err) {
            common.registrError(String(err));
        }
    }, []);
    const handleBack = () => {
    };
    const chat = useContext(ContextChat) as Chat;
    return (
        <>
            {chat.isPrivateRoom && (

                            <Button align={'flex-start'} isNotCentrAlign={true} onClick={handleBack}>Назад</Button>
                            <PrivateRoom />

            )}
            {!chat.isPrivateRoom && <Users />}
        </>
    );
};

export default observer(ChatPage);
