import { FunctionComponent, useContext } from 'react';
import { observer } from 'mobx-react-lite';


import Flex from '../styledComponents/Flex';
import Card from '../styledComponents/Card';
import { ContextChat } from '../../store/contexts';
import { Chat } from '../../store/chat';

const Users: FunctionComponent = () => {
    const chat = useContext(ContextChat) as Chat;
    
    const handleUserClick = (userID: string, name: string) => (): void => {
    };
    
    return (
        <main>
            Users List
            <Flex width="100%" height="100%">
                {chat.rooms.map(({roomId, interlocutorName, interlocutorId}) => (
                    <Card
                        key={roomId}
                        onClick={handleUserClick(user.userID, user.name)}
                    >
                        {user.name}
                    </Card>
                ))}
            </Flex>
        </main>
    );
};

export default observer(Users);
