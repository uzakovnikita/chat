import { useContext, useEffect } from 'react';
import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { ContextAuth, ContextChat } from '../../store/contexts';

import Rooms from '../../components/Rooms';
import PrivateRoom from '../../components/PrivateRoom';
import Button from '../../components/styledComponents/Button';



const ChatPage: FunctionComponent = () => {
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;
    useEffect(() => {
        try {
            chat.connect(auth.id);
        } catch (err) {
            chat.registrError(String(err));
        }
    }, [auth.id, chat]);
    const handleBack = () => {
        chat.leave()
    };
    
    return (
        <>
            {chat.isPrivateRoom && (
                <>
                    <Button align={'flex-start'} isNotCentrAlign={true} onClick={handleBack}>Назад</Button>
                    <PrivateRoom />
                </>
            )}
            {!chat.isPrivateRoom && <Rooms />}
        </>
    );
};

export default observer(ChatPage);
