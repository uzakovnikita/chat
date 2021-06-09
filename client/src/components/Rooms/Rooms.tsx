import { FunctionComponent, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Flex from '../styledComponents/Flex';
import Card from '../styledComponents/Card';
import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';

const Rooms: FunctionComponent = () => {
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

    const handleUserClick = (roomId: string, interlocutorName: string, interlocutorId: string) => (): void => {
        chat.join(roomId, interlocutorName, interlocutorId, auth.id as string);
    };

    useEffect(() => {
        (async () => {
            const { id } = auth;
            await chat.getRooms(id as string);
        })();
    }, [auth, chat]);

    return (
        <>
            Users List
            <Flex width='100%' height='100%'>
                {chat.rooms.map(
                    ({ roomId, interlocutorName, interlocutorId }) => {
                        return <Card key={roomId} onClick={handleUserClick(roomId, interlocutorName, interlocutorId)}>{interlocutorName}</Card>;
                    },
                )}
            </Flex>
        </>
    );
};

export default observer(Rooms);