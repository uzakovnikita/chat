import { FunctionComponent, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Flex from '../styledComponents/Flex';
import Card from '../styledComponents/Card';
import Title from '../styledComponents/Title';
import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { relative } from 'path';


const CardText = styled.span`
    position: relative;
    z-index: 10;
`


const Rooms: FunctionComponent = () => {
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;
    const router = useRouter();
    const handleUserClick =
        (roomId: string, interlocutorName: string, interlocutorId: string) =>
        (): void => {
            chat.join(
                roomId,
                interlocutorName,
                interlocutorId,
                auth.id as string,
            );
            router.push(`/rooms/${roomId}`)
        };

    return (
        <>
            <Title>Users List</Title>
            <Flex width='100%' height='100%' justify='flex-start'>
                {chat.rooms?.map(
                    ({ roomId, interlocutorName, interlocutorId }) => {
                        return (
                            <Card
                                key={roomId}
                                onClick={handleUserClick(
                                    roomId,
                                    interlocutorName,
                                    interlocutorId,
                                )}
                            >
                                <CardText>{interlocutorName}</CardText>
                            </Card>
                        );
                    },
                )}
            </Flex>
        </>
    );
};

export default observer(Rooms);
